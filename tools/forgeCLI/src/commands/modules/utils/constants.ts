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
 * Babel AST generation options
 */
export const AST_GENERATION_OPTIONS = {
  retainLines: false,
  compact: false,
  jsescOption: {
    quotes: 'single' as const
  }
} as const
