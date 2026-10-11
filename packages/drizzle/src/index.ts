export { defineModuleSchema } from './defineModuleSchema'

export { createModuleTable } from './createModuleTable'

export { proxyDbQuery, scopeDbForModule } from './proxyDbQuery'

export { composeRelations } from './composeRelations'

export type {
  BuiltModuleSchema,
  ModuleSchema,
  ResolvedModuleSchema
} from '@lifeforge/module-runtime/registry'
