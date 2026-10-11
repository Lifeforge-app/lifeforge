import { log } from '@clack/prompts'
import chalk from 'chalk'

import { listLocalesWithMeta } from '../functions/listLocales'

export function listLocalesHandler(): void {
  const locales = listLocalesWithMeta()

  if (locales.length === 0) {
    log.step('No language packs installed')
    log.step(
      'Use "pnpm forge locales install <lang>" to install a language pack'
    )

    return
  }

  log.step(`Installed language packs (${locales.length}):`)

  for (const locale of locales.sort((a, b) => a.name.localeCompare(b.name))) {
    log.message(
      `  ${chalk.blue(locale.name)} - ${locale.displayName} (v.${locale.version})`
    )
  }
}
