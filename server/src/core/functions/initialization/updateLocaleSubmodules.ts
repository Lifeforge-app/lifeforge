import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

import { LoggingService } from '../logging/loggingService'

/**
 * Gets the list of installed locale submodules from .gitmodules
 */
function getInstalledLocales(rootDir: string): string[] {
  const gitmodulesPath = path.join(rootDir, '.gitmodules')

  if (!fs.existsSync(gitmodulesPath)) {
    return []
  }

  const content = fs.readFileSync(gitmodulesPath, 'utf-8')

  const localeMatches = content.match(/\[submodule "locales\/([^"]+)"\]/g)

  if (!localeMatches) {
    return []
  }

  return localeMatches
    .map(match => {
      const localeMatch = match.match(/\[submodule "locales\/([^"]+)"\]/)

      return localeMatch ? localeMatch[1] : ''
    })
    .filter(Boolean)
}

/**
 * Removes cached git entries for locales that are not installed
 */
function removeCachedNonInstalledLocales(rootDir: string): void {
  const localesDir = path.join(rootDir, 'locales')

  if (!fs.existsSync(localesDir)) {
    return
  }

  const installedLocales = getInstalledLocales(rootDir)

  const allLocaleDirs = fs
    .readdirSync(localesDir)
    .filter(entry => fs.statSync(path.join(localesDir, entry)).isDirectory())

  for (const localeDir of allLocaleDirs) {
    if (!installedLocales.includes(localeDir)) {
      try {
        LoggingService.info(
          `Removing cached locale '${localeDir}' (not installed)...`,
          'LOCALES'
        )

        execSync(`git rm -r --cached locales/${localeDir}`, {
          cwd: rootDir,
          stdio: 'pipe'
        })
      } catch {
        // Ignore errors - the locale may not be tracked
      }
    }
  }
}

/**
 * Updates all language pack submodules in the locales directory
 */
export default function updateLocaleSubmodules(): void {
  const rootDir = path.resolve(import.meta.dirname.split('server')[0])

  try {
    LoggingService.info('Updating language pack submodules...', 'LOCALES')

    // Remove cached entries for locales that are not installed
    removeCachedNonInstalledLocales(rootDir)

    execSync('git submodule update --init --remote --recursive -- locales', {
      cwd: rootDir,
      stdio: 'pipe'
    })

    LoggingService.info(
      'Language pack submodules updated successfully',
      'LOCALES'
    )
  } catch (error) {
    LoggingService.warn(
      `Failed to update language pack submodules: ${error}`,
      'LOCALES'
    )
  }
}
