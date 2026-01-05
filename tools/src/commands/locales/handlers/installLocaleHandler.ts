import fs from 'fs'

import { installPackage } from '@/utils/commands'
import initGitRepository from '@/utils/initGitRepository'
import Logging from '@/utils/logging'
import normalizePackage from '@/utils/normalizePackage'

import setFirstLangInDB from '../functions/setFirstLangInDB'

export async function installLocaleHandler(langCode: string): Promise<void> {
  const { fullName, shortName, targetDir } = normalizePackage(
    langCode,
    'locale'
  )

  if (!/^@lifeforge\/lang-[a-z]{2}(-[A-Z]{2})?$/i.test(fullName)) {
    Logging.actionableError(
      `Invalid locale name: ${Logging.highlight(langCode)}`,
      'Locale names should follow the format "xx" or "xx-XX", where "xx" is a two-letter language code and "XX" is a two-letter country code.'
    )
    process.exit(1)
  }

  if (fs.existsSync(targetDir)) {
    Logging.actionableError(
      `Locale already exists at locales/${shortName}`,
      `Remove it first with: bun forge locales uninstall ${shortName}`
    )

    process.exit(1)
  }

  Logging.info(`Installing ${Logging.highlight(fullName)}...`)

  try {
    installPackage(fullName, targetDir)
    initGitRepository(targetDir)

    await setFirstLangInDB(shortName)

    Logging.success(`Installed ${Logging.highlight(fullName)}`)
  } catch (error) {
    Logging.actionableError(
      `Failed to install ${Logging.highlight(fullName)}`,
      'Make sure the locale exists in the registry'
    )
    throw error
  }
}
