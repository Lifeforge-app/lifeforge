import type { ModuleInstallConfig } from './constants'

/**
 * Validation utilities for module operations
 */

/**
 * Validates module repository path format
 */
export function validateRepositoryPath(repoPath: string): boolean {
  return /^[\w-]+\/[\w-]+$/.test(repoPath)
}

/**
 * Creates module installation configuration
 */
export function createModuleConfig(repoPath: string): ModuleInstallConfig {
  const [author, moduleName] = repoPath.split('/')

  if (!moduleName.startsWith('lifeforge-module-')) {
    throw new Error(
      `Module name must start with 'lifeforge-module-'. Received: ${moduleName}`
    )
  }

  const finalModuleName = moduleName.replace(/^lifeforge-module-/, '')

  return {
    tempDir: '.temp',
    moduleDir: `apps/${finalModuleName}`,
    author,
    moduleName: finalModuleName,
    repoUrl: `https://github.com/${author}/${moduleName}.git`
  }
}
