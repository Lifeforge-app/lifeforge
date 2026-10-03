export { defineModuleSchema } from './defineModuleSchema'

export { createModuleTable } from './createModuleTable'

export { deriveModuleNamespace, detectCallerModuleId } from './moduleNamespace'

export { proxyDbQuery, scopeDbForModule } from './proxyDbQuery'

export {
  type BuiltModuleSchema,
  type ModuleSchema,
  type ModuleSchemaDefinition,
  type SchemaEntry
} from './types'

export { composeRelations } from './composeRelations'
