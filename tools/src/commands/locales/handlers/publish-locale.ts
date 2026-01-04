import fs from 'fs'

import { executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

import { validateMaintainerAccess } from '../../../utils/github-cli'
import { checkAuth, getRegistryUrl } from '../../../utils/registry'
import getLocalesMeta from '../functions/getLocalesMeta'
import { validateLocaleStructure } from '../functions/validateLocaleStructure'

export async function publishLocaleHandler(
  langCode: string,
  options?: { official?: boolean }
): Promise<void> {
  const { targetDir, shortName } = getLocalesMeta(langCode)

  if (!fs.existsSync(targetDir)) {
    CLILoggingService.actionableError(
      `Locale "${langCode}" not found in locales/`,
      'Run "bun forge locales list" to see available locales'
    )

    return
  }

  validateLocaleStructure(targetDir)

  const auth = await checkAuth()

  if (options?.official) {
    validateMaintainerAccess(auth.username ?? '')
  }

  try {
    executeCommand(`npm publish --registry ${getRegistryUrl()}`, {
      cwd: targetDir,
      stdio: 'inherit'
    })

    CLILoggingService.success(`Locale "${shortName}" published successfully!`)
  } catch (error) {
    CLILoggingService.actionableError(
      'Failed to publish locale',
      'Check if you are properly authenticated with the registry'
    )
    throw error
  }
}
