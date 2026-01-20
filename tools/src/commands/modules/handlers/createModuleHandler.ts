import logger from '@/utils/logger'

import { registerHandlebarsHelpers } from '../functions/templates'

registerHandlebarsHelpers()

export const AVAILABLE_TEMPLATE_MODULE_TYPES = {
  'bare-bones': 'Minimal setup with basic structure',
  'with-crud': 'Full CRUD operations ready',
  'with-routes': 'Multiple routes and navigation',
  'client-only': 'Client-side only functionality'
} as const

export async function createModuleHandler(moduleName?: string): Promise<void> {
  logger.info('Work in progress...')
  // checkRunningPBInstances()
  // const moduleNameWithTranslation = await promptForModuleName(moduleName)
  // const moduleType = await promptModuleType()
  // checkModuleTypeAvailability(moduleType)
  // const moduleIcon = await selectIcon()
  // const moduleDesc = await promptModuleDescription()
  // const moduleCategory = await promptModuleCategory()
  // const moduleMetadata: ModuleMetadata = {
  //   moduleName: moduleNameWithTranslation,
  //   moduleIcon,
  //   moduleDesc,
  //   moduleType,
  //   moduleCategory
  // }
  // const camelizedModuleName = _.camelCase(moduleMetadata.moduleName.en)
  // copyTemplateFiles(moduleMetadata)
  // initializeGitRepository(`${process.cwd()}/apps/${camelizedModuleName}`)
  // installDependencies(`${process.cwd()}/apps`)
  // // Regenerate registries to include the new module
  // generateModuleRegistries()
  // if (
  //   fs.existsSync(
  //     `${process.cwd()}/apps/${camelizedModuleName}/server/schema.ts`
  //   )
  // ) {
  //   runDatabaseMigrations()
  //   generateDatabaseSchemas()
  // }
  // CLILoggingService.success(
  //   `Module "${moduleMetadata.moduleName.en}" setup is complete!`
  // )
}
