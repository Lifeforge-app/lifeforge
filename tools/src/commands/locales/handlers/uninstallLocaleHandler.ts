import { log } from '@clack/prompts'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

import { installDeps } from '@/utils/commands'
import { ROOT_DIR } from '@/utils/constants'
import { removeLocked } from '@/utils/moduleLock'
import { withSpinner } from '@/utils/spinner'

import ensureLocaleNotInUse from '../functions/ensureLocaleNotInUse'
import { resolveLocale } from '../functions/listLocales'

export async function uninstallLocaleHandler(langCode: string): Promise<void> {
  const mod = resolveLocale(langCode)

  if (!mod) {
    log.error(`Locale "${langCode}" is not installed`)

    process.exit(1)
  }

  await ensureLocaleNotInUse(mod.code)

  const symlinkPath = path.join(ROOT_DIR, 'node_modules', mod.name)

  try {
    await withSpinner(
      `Uninstalling ${chalk.blue(mod.name)}...`,
      () => {
        fs.rmSync(symlinkPath, { recursive: true, force: true })
        fs.rmSync(mod.dir, { recursive: true, force: true })

        removeLocked('locales', mod.id)
      },
      {
        success: `Uninstalled ${chalk.blue(mod.name)}`,
        fail: `Failed to uninstall ${chalk.blue(mod.name)}`
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
