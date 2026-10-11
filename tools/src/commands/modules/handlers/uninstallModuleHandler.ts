import { log } from '@clack/prompts'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/constants/constants'
import { installDeps } from '@/utils/commands'
import { removeLocked } from '@/utils/moduleLock'
import normalizePackage from '@/utils/normalizePackage'
import { findPackageName, removeDependency } from '@/utils/packageJson'
import { withSpinner } from '@/utils/spinner'

/**
 * Uninstalls one or more modules.
 *
 * For each module:
 * 1. Validates it exists in package.json
 * 2. Removes symlink from node_modules
 * 3. Removes module directory from modules/
 * 4. Removes from package.json dependencies and the lockfile
 *
 * After uninstallation:
 * - Runs pnpm install to clean up
 */
export async function uninstallModuleHandler(
  moduleNames: string[]
): Promise<void> {
  const uninstalled: string[] = []

  for (const moduleName of moduleNames) {
    const { targetDir, fullName, shortName } = normalizePackage(moduleName)

    if (!findPackageName(fullName, 'modules')) {
      log.error(
        `Module ${chalk.blue(fullName)} not found in modules/package.json`
      )
      continue
    }

    const symlinkPath = path.join(ROOT_DIR, 'node_modules', fullName)

    try {
      await withSpinner(
        `Uninstalling ${chalk.blue(fullName)}...`,
        () => {
          removeDependency(fullName, 'modules')

          fs.rmSync(symlinkPath, { recursive: true, force: true })
          fs.rmSync(targetDir, { recursive: true, force: true })

          removeLocked('modules', shortName)
        },
        {
          success: `Uninstalled ${chalk.blue(fullName)}`,
          fail: `Failed to uninstall ${chalk.blue(fullName)}`
        }
      )

      uninstalled.push(moduleName)
    } catch {
      // Already reported by the spinner
    }
  }

  if (uninstalled.length === 0) {
    return
  }

  try {
    await withSpinner('Installing dependencies...', () => installDeps(), {
      success: 'Dependencies installed'
    })
  } catch {
    log.error('Failed to install dependencies')
    process.exit(1)
  }
}
