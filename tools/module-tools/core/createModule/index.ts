/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import chalk from 'chalk'
import prompts from 'prompts'
import confirmData from './functions/confirmData'
import getModuleDescInOtherLangs from './functions/getModuleDescInOtherLangs'
import getModuleNameInOtherLangs from './functions/getModuleNameInOtherLangs'
import promptModuleIcon from './functions/promptModuleIcon'
import saveChanges from './functions/saveChanges'
import { CATEGORIES } from '../../constants/routes'
import { toCamelCase, toDashCase } from '../../utils/strings'

async function createModule(
  login: any,
  t: (key: string) => string
): Promise<void> {
  const moduleIcon = await promptModuleIcon()

  t('lol') // TODO - remove this line lol

  if (!moduleIcon) {
    return
  }

  const moduleNameEN = await prompts({
    type: 'text',
    name: 'moduleName',
    message: 'Module name (in English)',
    validate: value => {
      if (!value) {
        return 'Module name is required'
      }
      return true
    }
  })

  if (!moduleNameEN.moduleName) {
    return
  }

  const moduleID = toCamelCase(moduleNameEN.moduleName.toLowerCase())
  const modulePath = toDashCase(moduleNameEN.moduleName)

  const moduleNameInOtherLangs = await getModuleNameInOtherLangs({
    login,
    moduleName: moduleNameEN.moduleName
  })

  if (!moduleNameInOtherLangs) {
    return
  }

  const moduleDescInOtherLangs = await getModuleDescInOtherLangs({
    login,
    moduleName: moduleNameEN.moduleName
  })

  if (!moduleDescInOtherLangs) {
    return
  }

  const moduleCategory = await prompts({
    type: 'select',
    name: 'moduleCategory',
    message: 'Select the module category',
    choices: CATEGORIES.map((e: any) => ({ title: e, value: e })),
    validate: value => {
      if (!value) {
        return 'Module category is required'
      }
      return true
    }
  })

  const togglable = await prompts({
    type: 'toggle',
    name: 'value',
    message: 'Is this module togglable?',
    initial: true,
    active: 'Yes',
    inactive: 'No'
  })

  if (!moduleCategory.moduleCategory) {
    return
  }

  const confirmation = await confirmData({
    moduleID,
    modulePath,
    moduleIcon,
    moduleNameEN,
    moduleNameInOtherLangs,
    moduleDescInOtherLangs,
    moduleCategory,
    togglable
  })

  if (!confirmation) {
    return
  }

  const changesSaved = await saveChanges({
    login,
    moduleID,
    modulePath,
    moduleNameEN,
    moduleNameInOtherLangs,
    moduleDescInOtherLangs,
    moduleCategory,
    togglable,
    moduleIcon
  })

  if (!changesSaved) {
    return
  }

  console.log(chalk.green('✔ Module created successfully'))
}

export default createModule
