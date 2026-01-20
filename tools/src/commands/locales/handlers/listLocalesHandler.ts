import chalk from 'chalk'

import logger from '@/utils/logger'

import { listLocalesWithMeta } from '../functions/listLocales'

export function listLocalesHandler(): void {
  const locales = listLocalesWithMeta()

  if (locales.length === 0) {
    logger.info('No language packs installed')
    logger.info(
      'Use "bun forge locales install <lang>" to install a language pack'
    )

    return
  }

  logger.info(`Installed language packs (${locales.length}):`)

  for (const locale of locales.sort((a, b) => a.name.localeCompare(b.name))) {
    logger.print(
      `  ${chalk.blue(locale.name)} - ${locale.displayName} (v.${locale.version})`
    )
  }
}
