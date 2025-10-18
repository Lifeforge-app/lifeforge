import fs from 'fs'
import path from 'path'

/**
 * File system utilities for module operations
 */

/**
 * Checks if module already exists in the apps directory
 */
export function moduleExists(moduleName: string): boolean {
  return fs.existsSync(`apps/${moduleName}`)
}

/**
 * Checks if module has server components
 */
export function hasServerComponents(moduleName: string): {
  hasServerDir: boolean
  hasServerIndex: boolean
} {
  const serverPath = path.resolve(`apps/${moduleName}/server`)

  const serverIndexPath = path.resolve(`apps/${moduleName}/server/index.ts`)

  return {
    hasServerDir: fs.existsSync(serverPath),
    hasServerIndex: fs.existsSync(serverIndexPath)
  }
}

/**
 * Gets list of installed modules from apps directory
 */
export function getInstalledModules(): string[] {
  const appsDir = 'apps'

  if (!fs.existsSync(appsDir)) {
    return []
  }

  return fs
    .readdirSync(appsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !name.startsWith('.')) // Exclude hidden directories
}

/**
 * Cleans up temporary directory
 */
export function cleanup(tempDir: string): void {
  if (fs.existsSync(tempDir)) {
    fs.rmdirSync(tempDir, { recursive: true })
  }
}
