export { ModuleRegistry, registerModulePath } from './registry/ModuleRegistry'

export {
  deriveModuleNamespace,
  resolveCallerModuleId,
  resolveModuleId
} from './moduleNamespace'

export type {
  BuiltModuleSchema,
  ModuleSchema,
  ModuleSchemaDefinition,
  SchemaEntry
} from './types'
