/**
 * Module installation configuration
 */
export interface ModuleInstallConfig {
  tempDir: string
  moduleDir: string
  author: string
  moduleName: string
  repoUrl: string
}

/**
 * Configuration paths for server files
 */
export const SERVER_CONFIG = {
  ROUTES_FILE: 'server/src/core/routes/app.routes.ts',
  SCHEMA_FILE: 'server/src/core/schema.ts'
} as const

/**
 * Module structure validation requirements
 */
export const MODULE_STRUCTURE_REQUIREMENTS = [
  {
    path: 'client',
    type: 'directory' as const
  },
  {
    path: 'package.json',
    type: 'file' as const
  }
]

/**
 * Babel AST generation options
 */
export const AST_GENERATION_OPTIONS = {
  retainLines: false,
  compact: false,
  jsescOption: {
    quotes: 'single' as const
  }
} as const
