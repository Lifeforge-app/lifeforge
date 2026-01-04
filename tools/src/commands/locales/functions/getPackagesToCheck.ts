import CLILoggingService from '@/utils/logging'

import { getInstalledLocalesWithMeta } from './getInstalledLocales'
import { normalizeLocalePackageName } from './getLocalesMeta'

function getPackagesToCheck(langCode?: string) {
  const localePackages = getInstalledLocalesWithMeta()

  if (!localePackages.length) {
    CLILoggingService.info('No locales installed')

    process.exit(0)
  }

  const packagesToCheck = langCode
    ? localePackages.filter(
        p => p.name === normalizeLocalePackageName(langCode)
      )
    : localePackages

  if (!packagesToCheck?.length) {
    CLILoggingService.actionableError(
      `Locale "${langCode}" is not installed`,
      'Run "bun forge locales list" to see installed locales'
    )

    process.exit(0)
  }

  return packagesToCheck
}

export default getPackagesToCheck
