import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

import CLILoggingService from '@/utils/logging'

import { getInstalledLocales } from '../utils'

/**
 * Lists all installed locales
 */
export function listLocalesHandler(): void {
  const locales = getInstalledLocales()

  if (locales.length === 0) {
    CLILoggingService.info('No language packs installed')
    CLILoggingService.info(
      'Use "bun forge locales add <lang>" to install a language pack'
    )

    return
  }

  CLILoggingService.info(`Installed language packs (${locales.length}):`)

  for (const locale of locales) {
    const manifestPath = path.join('locales', locale, 'manifest.json')

    let displayName = locale

    if (fs.existsSync(manifestPath)) {
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))

        displayName = manifest.displayName || locale
      } catch {
        // Use locale name as fallback
      }
    }

    console.log(`  ${chalk.bold.blue(locale)} - ${displayName}`)
  }
}
