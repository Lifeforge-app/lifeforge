import logger from '@/utils/logger'
import normalizePackage from '@/utils/normalizePackage'

import { listLocalesWithMeta } from './listLocales'

function getPackagesToCheck(langCode?: string) {
  const localePackages = listLocalesWithMeta()

  if (!localePackages.length) {
    logger.info('No locales installed')

    process.exit(0)
  }

  const packagesToCheck = langCode
    ? localePackages.filter(
        p => p.name === normalizePackage(langCode, 'locale').fullName
      )
    : localePackages

  if (!packagesToCheck?.length) {
    logger.error(`Locale "${langCode}" is not installed`)

    process.exit(0)
  }

  return packagesToCheck
}

export default getPackagesToCheck
