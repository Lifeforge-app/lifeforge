import { log } from '@clack/prompts'

import { listLocalesWithMeta } from './listLocales'

function getPackagesToCheck(langCode?: string) {
  const localePackages = listLocalesWithMeta()

  if (!localePackages.length) {
    log.step('No locales installed')

    process.exit(0)
  }

  const packagesToCheck = langCode
    ? localePackages.filter(p => p.id === langCode)
    : localePackages

  if (!packagesToCheck.length) {
    log.error(`Locale "${langCode}" is not installed`)

    process.exit(0)
  }

  return packagesToCheck
}

export default getPackagesToCheck
