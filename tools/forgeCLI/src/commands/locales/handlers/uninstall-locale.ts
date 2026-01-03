import fs from 'fs'

import { executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'
import { findPackageName, removeWorkspaceDependency } from '@/utils/package'

import ensureLocaleNotInUse from '../functions/ensureLocaleNotInUse'
import getLocalesMeta from '../functions/getLocalesMeta'

export async function uninstallLocaleHandler(langCode: string): Promise<void> {
  const { fullPackageName, shortName, targetDir } = getLocalesMeta(langCode)

  const found = findPackageName(fullPackageName)

  if (!found) {
    CLILoggingService.actionableError(
      `Locale "${shortName}" is not installed`,
      'Run "bun forge locales list" to see installed locales'
    )

    return
  }

  await ensureLocaleNotInUse(shortName)

  CLILoggingService.info(`Uninstalling locale ${fullPackageName}...`)

  fs.rmSync(targetDir, { recursive: true, force: true })

  removeWorkspaceDependency(fullPackageName)

  executeCommand('bun install', { cwd: process.cwd(), stdio: 'inherit' })

  CLILoggingService.info(`Uninstalled locale ${fullPackageName}`)
}
