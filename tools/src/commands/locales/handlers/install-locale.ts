import fs from 'fs'

import CLILoggingService from '@/utils/logging'

import getLocalesMeta from '../functions/getLocalesMeta'
import installAndMoveLocales from '../functions/installAndMoveLocales'
import setFirstLangInDB from '../functions/setFirstLangInDB'

export async function installLocaleHandler(langCode: string): Promise<void> {
  const { fullPackageName, shortName, targetDir } = getLocalesMeta(langCode)

  if (fs.existsSync(targetDir)) {
    CLILoggingService.actionableError(
      `Locale already exists at locales/${shortName}`,
      `Remove it first with: bun forge locales uninstall ${shortName}`
    )

    process.exit(1)
  }

  CLILoggingService.progress('Fetching locale from registry...')

  try {
    installAndMoveLocales(fullPackageName, targetDir)

    await setFirstLangInDB(shortName)

    CLILoggingService.success(
      `Locale ${fullPackageName} installed successfully!`
    )
  } catch (error) {
    CLILoggingService.actionableError(
      `Failed to install ${fullPackageName}`,
      'Make sure the locale exists in the registry'
    )
    throw error
  }
}
