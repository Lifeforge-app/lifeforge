/**
 * Type definitions for database commands
 */

export interface Environment {
  PB_DIR?: string
  PB_HOST?: string
  PB_EMAIL?: string
  PB_PASSWORD?: string
}

export interface SchemaModule {
  moduleName: string
  schema: Record<string, { raw: unknown }>
}

export interface MigrationResult {
  success: boolean
  migrationPath?: string
  error?: string
}

export interface ModuleCollectionsMap {
  [moduleName: string]: any[]
}

export interface PocketBaseField {
  name: string
  type: string
  required?: boolean
  maxSelect?: number
  values?: string[]
  [key: string]: unknown
}

export interface FieldTypeMapping {
  [fieldType: string]: (field: PocketBaseField) => string
}
