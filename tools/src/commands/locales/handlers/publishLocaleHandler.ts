import chalk from 'chalk'
import fs from 'fs'

import bumpPackageVersion, {
  revertPackageVersion
} from '@/utils/bumpPackageVersion'
import executeCommand from '@/utils/commands'
import logger from '@/utils/logger'
import normalizePackage from '@/utils/normalizePackage'

import { validateMaintainerAccess } from '../../../utils/github-cli'
import { checkAuth, getRegistryUrl } from '../../../utils/registry'
import { validateLocaleStructure } from '../functions/validateLocaleStructure'

export async function publishLocaleHandler(
  langCode: string,
  options?: { official?: boolean }
): Promise<void> {
  const { fullName, targetDir } = normalizePackage(langCode, 'locale')

  if (!fs.existsSync(targetDir)) {
    logger.actionableError(
      `Locale "${langCode}" not found in locales/`,
      'Run "bun forge locales list" to see available locales'
    )

    return
  }

  logger.info('Validating locale structure...')
  validateLocaleStructure(targetDir)

  const auth = await checkAuth()

  if (options?.official) {
    logger.info('Validating maintainer access...')
    validateMaintainerAccess(auth.username ?? '')
  }

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
