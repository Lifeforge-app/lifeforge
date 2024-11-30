/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import chalk from 'chalk'
import dotenv from 'dotenv'
import prompts from 'prompts'
import fs from 'fs'

import confirmData from './functions/confirmData'
import getModuleDescInOtherLangs from './functions/getModuleDescInOtherLangs'
import getModuleNameInOtherLangs from './functions/getModuleNameInOtherLangs'
import loginUser from './functions/loginUser'
import promptModuleIcon from './functions/promptModuleIcon'
import saveChanges from './functions/saveChanges'
import { toCamelCase, toDashCase } from './utils/strings'

dotenv.config({
  path: '.env.development.local'
})

const ROUTES = JSON.parse(fs.readFileSync('./src/routes_config.json', 'utf-8'))

const CATEGORIES = ROUTES.map((e: any) => e.title).filter((e: string) => e)
;(async () => {
  const [loggedIn, login] = await loginUser()

  if (!loggedIn) {
    return
  }

  const moduleIcon = await promptModuleIcon()

  if (!moduleIcon) {
    return
  }

  const moduleNameEN = await prompts({
    type: 'text',
    name: 'moduleName',
    message: 'Enter the module name (in English)',
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
    moduleID
  })

  if (!moduleNameInOtherLangs) {
    return
  }

  const moduleDescEN = await prompts({
    type: 'text',
    name: 'moduleDesc',
    message: 'Enter the module description (in English)',
    validate: value => {
      if (!value) {
        return 'Module description is required'
      }
      return true
    }
  })

  if (!moduleDescEN.moduleDesc) {
    return
  }

  const moduleDescInOtherLangs = await getModuleDescInOtherLangs({
    login,
    moduleDesc: moduleDescEN.moduleDesc
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
    moduleDescEN,
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
    moduleDescEN,
    moduleDescInOtherLangs,
    moduleCategory,
    togglable,
    moduleIcon
  })

  if (!changesSaved) {
    return
  }

  console.log(chalk.green('✔ Module created successfully'))
})().catch(console.error)
