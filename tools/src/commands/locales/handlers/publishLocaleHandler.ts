import chalk from 'chalk'
import fs from 'fs'

import bumpPackageVersion, {
  revertPackageVersion
} from '@/utils/bumpPackageVersion'
import executeCommand from '@/utils/commands'
import logger from '@/utils/logger'
import normalizePackage from '@/utils/normalizePackage'

import { getRegistryUrl } from '../../../utils/registry'
import validateLocalesAuthor from '../functions/validateLocalesAuthor'
import { validateLocaleStructureHandler } from './validateLocaleStructure'

export async function publishLocaleHandler(langCode: string): Promise<void> {
  const { fullName, targetDir } = normalizePackage(langCode, 'locale')

  if (!fs.existsSync(targetDir)) {
    logger.error(`Locale "${langCode}" not found in locales/`)

    process.exit(1)
  }

  logger.info('Validating locale structure...')
  validateLocaleStructureHandler(langCode)

  logger.debug('Validating module author...')
  await validateLocalesAuthor(targetDir)

  const { oldVersion, newVersion } = bumpPackageVersion(targetDir)

  logger.info(
    `Bumped version: ${chalk.blue(oldVersion)} → ${chalk.blue(newVersion)}`
  )

  logger.info(`Publishing ${chalk.blue(fullName)}...`)

  try {
    executeCommand(`bun publish --registry ${getRegistryUrl()}`, {
      cwd: targetDir
    })

    logger.success(`Published ${chalk.blue(fullName)}`)
  } catch (error) {
    revertPackageVersion(targetDir, oldVersion)

    logger.error(`Failed to publish ${chalk.blue(fullName)}`)
    logger.debug(`Error details: ${error}`)
    process.exit(1)
  }
}
