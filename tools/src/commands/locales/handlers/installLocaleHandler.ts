import fs from 'fs'

import Logging from '@/utils/logging'
import normalizePackage from '@/utils/normalizePackage'

import installAndMoveLocales from '../functions/installAndMoveLocales'
import setFirstLangInDB from '../functions/setFirstLangInDB'

export async function installLocaleHandler(langCode: string): Promise<void> {
  const { fullName, shortName, targetDir } = normalizePackage(
    langCode,
    'locale'
  )

  if (fs.existsSync(targetDir)) {
    Logging.actionableError(
      `Locale already exists at locales/${shortName}`,
      `Remove it first with: bun forge locales uninstall ${shortName}`
    )

    process.exit(1)
  }

  Logging.info(`Installing ${Logging.highlight(fullName)}...`)

  try {
    installAndMoveLocales(fullName, targetDir)

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
