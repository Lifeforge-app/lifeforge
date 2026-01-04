import Logging from '@/utils/logging'
import normalizePackage from '@/utils/normalizePackage'

import { listLocalesWithMeta } from './listLocales'

function getPackagesToCheck(langCode?: string) {
  const localePackages = listLocalesWithMeta()

  if (!localePackages.length) {
    Logging.info('No locales installed')

    process.exit(0)
  }

  const packagesToCheck = langCode
    ? localePackages.filter(
        p => p.name === normalizePackage(langCode, 'locale').fullName
      )
    : localePackages

  if (!packagesToCheck?.length) {
    Logging.actionableError(
      `Locale "${langCode}" is not installed`,
      'Run "bun forge locales list" to see installed locales'
    )

    process.exit(0)
  }

  return packagesToCheck
}

export default getPackagesToCheck
