import fs from 'fs'
import _ from 'lodash'

import { runDatabaseMigrations } from '@/commands/db/functions/database-initialization/migrations'
import CLILoggingService from '@/utils/logging'
import { checkRunningPBInstances } from '@/utils/pocketbase'

import { generateDatabaseSchemas } from '../functions/migrations'
import { installDependencies } from '../functions/module-lifecycle'
import {
  checkModuleTypeAvailability,
  promptForModuleName,
  promptModuleCategory,
  promptModuleDescription,
  promptModuleType,
  selectIcon
} from '../functions/prompts'
import {
  type ModuleMetadata,
  copyTemplateFiles,
  initializeGitRepository,
  registerHandlebarsHelpers
} from '../functions/templates'
import { injectModuleRoute } from '../utils/route-injection'
import { injectModuleSchema } from '../utils/schema-injection'

registerHandlebarsHelpers()

export async function createModuleHandler(moduleName?: string): Promise<void> {
  checkRunningPBInstances()

  const moduleNameWithTranslation = await promptForModuleName(moduleName)

  const moduleType = await promptModuleType()

  checkModuleTypeAvailability(moduleType)

  const moduleIcon = await selectIcon()

  const moduleDesc = await promptModuleDescription()

  const moduleCategory = await promptModuleCategory()

  const moduleMetadata: ModuleMetadata = {
    moduleName: moduleNameWithTranslation,
    moduleIcon,
    moduleDesc,
    moduleType,
    moduleCategory
  }

  const camelizedModuleName = _.camelCase(moduleMetadata.moduleName.en)

  copyTemplateFiles(moduleMetadata)

  initializeGitRepository(`${process.cwd()}/apps/${camelizedModuleName}`)

  installDependencies(`${process.cwd()}/apps`)

  injectModuleRoute(camelizedModuleName)
  injectModuleSchema(camelizedModuleName)

  if (
    fs.existsSync(
      `${process.cwd()}/apps/${camelizedModuleName}/server/schema.ts`
    )
  ) {
    runDatabaseMigrations()
    generateDatabaseSchemas()
  }

  CLILoggingService.success(
    `Module "${moduleMetadata.moduleName.en}" setup is complete!`
  )
}
