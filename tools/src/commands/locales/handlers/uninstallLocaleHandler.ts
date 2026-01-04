import fs from 'fs'

import { bunInstall } from '@/utils/commands'
import Logging from '@/utils/logging'
import normalizePackage from '@/utils/normalizePackage'
import { findPackageName, removeDependency } from '@/utils/packageJson'

import ensureLocaleNotInUse from '../functions/ensureLocaleNotInUse'

export async function uninstallLocaleHandler(langCode: string): Promise<void> {
  const { fullName, shortName, targetDir } = normalizePackage(
    langCode,
    'locale'
  )

  const found = findPackageName(fullName)

  if (!found) {
    Logging.actionableError(
      `Locale "${shortName}" is not installed`,
      'Run "bun forge locales list" to see installed locales'
    )

    return
  }

  await ensureLocaleNotInUse(shortName)

  Logging.info(`Uninstalling ${Logging.highlight(fullName)}...`)

  fs.rmSync(targetDir, { recursive: true, force: true })

  removeDependency(fullName)

  bunInstall()

  Logging.success(`Uninstalled ${Logging.highlight(fullName)}`)
}
