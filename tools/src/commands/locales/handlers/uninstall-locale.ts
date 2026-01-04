import fs from 'fs'

import { executeCommand } from '@/utils/helpers'
import Logging from '@/utils/logging'
import { findPackageName, removeDependency } from '@/utils/packageJson'

import ensureLocaleNotInUse from '../functions/ensureLocaleNotInUse'
import getLocalesMeta from '../functions/getLocalesMeta'

export async function uninstallLocaleHandler(langCode: string): Promise<void> {
  const { fullPackageName, shortName, targetDir } = getLocalesMeta(langCode)

  const found = findPackageName(fullPackageName)

  if (!found) {
    Logging.actionableError(
      `Locale "${shortName}" is not installed`,
      'Run "bun forge locales list" to see installed locales'
    )

    return
  }

  await ensureLocaleNotInUse(shortName)

  Logging.info(`Uninstalling locale ${fullPackageName}...`)

  fs.rmSync(targetDir, { recursive: true, force: true })

  removeDependency(fullPackageName)

  executeCommand('bun install', { cwd: process.cwd(), stdio: 'inherit' })

  Logging.info(`Uninstalled locale ${fullPackageName}`)
}
