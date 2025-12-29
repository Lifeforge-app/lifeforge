import type { PathConfig } from '@/utils/helpers'

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
export const MODULE_STRUCTURE_REQUIREMENTS: PathConfig[] = [
  {
    path: 'client',
    type: 'directory'
  },
  {
    path: 'package.json',
    type: 'file'
  },
  {
    path: 'manifest.ts',
    type: 'file'
  },
  {
    path: 'locales',
    type: 'directory'
  },
  {
    path: 'tsconfig.json',
    type: 'file'
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
