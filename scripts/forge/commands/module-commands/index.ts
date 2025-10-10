export { addModuleHandler } from './commands/add-module'
export { removeModuleHandler } from './commands/remove-module'
export { listModulesHandler } from './commands/list-modules'

// Export utilities for use by other CLI components
export {
  getInstalledModules,
  moduleExists,
  hasServerComponents,
  cleanup
} from './utils/file-system'

export { validateRepositoryPath, createModuleConfig } from './utils/validation'

export { createDynamicImport } from './utils/ast-utils'

// Export constants for use by other CLI components
export {
  SERVER_CONFIG,
  MODULE_STRUCTURE_REQUIREMENTS,
  AST_GENERATION_OPTIONS,
  type ModuleInstallConfig
} from './utils/constants'

// Export server injection utilities
export {
  injectModuleRoute,
  removeModuleRoute,
  injectModuleSchema,
  removeModuleSchema
} from './utils/server-injection'
