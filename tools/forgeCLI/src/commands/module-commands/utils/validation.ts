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

  return {
    tempDir: '.temp',
    moduleDir: `apps/${moduleName}`,
    author,
    moduleName,
    repoUrl: `https://github.com/${author}/lifeforge-module-${moduleName}.git`
  }
}
