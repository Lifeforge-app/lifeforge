import chalk from 'chalk'

import CLILoggingService from '@/utils/logging'

import { getInstalledLocalesWithMeta } from '../functions/getInstalledLocales'

export function listLocalesHandler(): void {
  const locales = getInstalledLocalesWithMeta()

  if (locales.length === 0) {
    CLILoggingService.info('No language packs installed')
    CLILoggingService.info(
      'Use "bun forge locales install <lang>" to install a language pack'
    )

    return
  }

  CLILoggingService.info(`Installed language packs (${locales.length}):`)

  for (const locale of locales.sort((a, b) => a.name.localeCompare(b.name))) {
    console.log(
      `  ${chalk.bold.blue(locale.name)} - ${locale.displayName} (v.${locale.version})`
    )
  }
}
