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
    logger.actionableError(
      `Locale "${langCode}" not found in locales/`,
      'Run "bun forge locales list" to see available locales'
    )

    return
  }

  logger.info('Validating locale structure...')
  validateLocaleStructureHandler({ lang: langCode })

  logger.debug('Validating module author...')
  await validateLocalesAuthor(targetDir)

  const { oldVersion, newVersion } = bumpPackageVersion(targetDir)

  logger.info(
    `Bumped version: ${chalk.blue(oldVersion)} → ${chalk.blue(newVersion)}`
  )

  logger.info(`Publishing ${chalk.blue(fullName)}...`)

  try {
    executeCommand(`npm publish --registry ${getRegistryUrl()}`, {
      cwd: targetDir,
      stdio: 'inherit'
    })

    logger.success(`Published ${chalk.blue(fullName)}`)
  } catch (error) {
    revertPackageVersion(targetDir, oldVersion)

    logger.actionableError(
      `Failed to publish ${chalk.blue(fullName)}`,
      'Check if you are properly authenticated with the registry'
    )

    throw error
  }
}
