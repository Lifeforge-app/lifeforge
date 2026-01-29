import chalk from 'chalk'
import fs from 'fs'

import { installPackage } from '@/utils/commands'
import initGitRepository from '@/utils/initGitRepository'
import logger from '@/utils/logger'
import normalizePackage from '@/utils/normalizePackage'

import setFirstLangInDB from '../functions/setFirstLangInDB'

export async function installLocaleHandler(langCode: string): Promise<void> {
  const { fullName, shortName, targetDir } = normalizePackage(
    langCode,
    'locale'
  )

  if (!/^@lifeforge\/lang-[a-z]{2}(-[A-Z]{2})?$/i.test(fullName)) {
    logger.error(
      `Invalid locale name: ${chalk.blue(langCode)}. Locale names should follow the format "xx" or "xx-XX", where "xx" is a two-letter language code and "XX" is a two-letter country code.`
    )
    process.exit(1)
  }

  if (fs.existsSync(targetDir)) {
    logger.error(
      `Locale already exists at locales/${shortName}. Remove it first with: bun forge locales uninstall ${shortName}`
    )

    process.exit(1)
  }

  logger.info(`Installing ${chalk.blue(fullName)}...`)

  try {
    installPackage(fullName, targetDir)
    initGitRepository(targetDir)

    await setFirstLangInDB(shortName)

    logger.success(`Installed ${chalk.blue(fullName)}`)
  } catch (error) {
    logger.error(`Failed to install ${chalk.blue(fullName)}`)
    logger.debug(`Error details: ${error}`)
    process.exit(1)
  }
}
