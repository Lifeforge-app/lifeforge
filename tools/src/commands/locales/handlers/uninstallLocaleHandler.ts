import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/constants/constants'
import { bunInstall } from '@/utils/commands'
import logger from '@/utils/logger'
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
    logger.error(`Locale "${shortName}" is not installed`)

    process.exit(1)
  }

  await ensureLocaleNotInUse(shortName)

  logger.info(`Uninstalling ${chalk.blue(fullName)}...`)

  const symlinkPath = path.join(ROOT_DIR, 'node_modules', fullName)

  fs.rmSync(symlinkPath, { recursive: true, force: true })
  fs.rmSync(targetDir, { recursive: true, force: true })

  removeDependency(fullName)

  bunInstall()

  logger.success(`Uninstalled ${chalk.blue(fullName)}`)
}
