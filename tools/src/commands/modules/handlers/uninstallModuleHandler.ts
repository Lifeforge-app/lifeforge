import { log } from '@clack/prompts'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

import { installDeps } from '@/utils/commands'
import { ROOT_DIR } from '@/utils/constants'
import { removeLocked } from '@/utils/moduleLock'
import { withSpinner } from '@/utils/spinner'

import { resolveModule } from '../functions/listModules'

/**
 * Uninstalls one or more modules.
 *
 * For each module:
 * 1. Resolves its directory by scanning `modules/`
 * 2. Removes symlink from node_modules
 * 3. Removes module directory from modules/
 * 4. Removes from the lockfile
 *
 * After uninstallation:
 * - Runs pnpm install to clean up
 */
export async function uninstallModuleHandler(
  moduleNames: string[]
): Promise<void> {
  const uninstalled: string[] = []

  for (const moduleName of moduleNames) {
    const mod = resolveModule(moduleName)

    if (!mod) {
      log.error(`Module ${chalk.blue(moduleName)} is not installed`)
      continue
    }

    const { id: shortName, dir: targetDir } = mod

    const fullName = `@lifeforge/${shortName}`

    const symlinkPath = path.join(ROOT_DIR, 'node_modules', fullName)

    try {
      await withSpinner(
        `Uninstalling ${chalk.blue(fullName)}...`,
        () => {
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
