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

import ensureLocaleNotInUse from '../functions/ensureLocaleNotInUse'

export async function uninstallLocaleHandler(langCode: string): Promise<void> {
  const { fullName, shortName, targetDir } = normalizePackage(
    langCode,
    'locale'
  )

  const found = findPackageName(fullName)

  if (!found) {
    log.error(`Locale "${shortName}" is not installed`)

    process.exit(1)
  }

  await ensureLocaleNotInUse(shortName)

  const symlinkPath = path.join(ROOT_DIR, 'node_modules', fullName)

  try {
    await withSpinner(
      `Uninstalling ${chalk.blue(fullName)}...`,
      () => {
        fs.rmSync(symlinkPath, { recursive: true, force: true })
        fs.rmSync(targetDir, { recursive: true, force: true })

        removeDependency(fullName)

        removeLocked('locales', shortName)
      },
      {
        success: `Uninstalled ${chalk.blue(fullName)}`,
        fail: `Failed to uninstall ${chalk.blue(fullName)}`
      }
    )
  } catch {
    process.exit(1)
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
