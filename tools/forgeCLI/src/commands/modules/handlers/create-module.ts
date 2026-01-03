import fs from 'fs'
import _ from 'lodash'

import { runDatabaseMigrations } from '@/commands/db/functions/database-initialization/migrations'
import CLILoggingService from '@/utils/logging'
import { checkRunningPBInstances } from '@/utils/pocketbase'

import { installDependencies } from '../functions/install-dependencies'
import { generateDatabaseSchemas } from '../functions/module-migrations'
import {
  checkModuleTypeAvailability,
  promptForModuleName,
  promptModuleCategory,
  promptModuleDescription,
  promptModuleType,
  selectIcon
} from '../functions/prompts'
import { generateModuleRegistries } from '../functions/registry/generator'
import {
  type ModuleMetadata,
  copyTemplateFiles,
  initializeGitRepository,
  registerHandlebarsHelpers
} from '../functions/templates'

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

  // Regenerate registries to include the new module
  generateModuleRegistries()

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
