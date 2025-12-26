// Re-export utilities for backward compatibility
export {
  writeFormattedFile,
  getSchemaFiles,
  importSchemaModules
} from './file-utils'

export { cleanupOldMigrations } from './pocketbase-utils'

export {
  buildModuleCollectionsMap,
  generateModuleSchemaContent,
  generateMainSchemaContent,
  processSchemaGeneration
} from '../functions/schema-generation'

export {
  generateMigrationContent,
  createMigrationFile
} from '../functions/migration-generation'

export {
  FIELD_TYPE_MAPPING,
  PRETTIER_OPTIONS,
  MIGRATION_PRETTIER_OPTIONS,
  SCHEMA_PATTERNS
} from './constants'

export type {
  Environment,
  SchemaModule,
  MigrationResult,
  ModuleCollectionsMap,
  PocketBaseField,
  FieldTypeMapping
} from './types'
