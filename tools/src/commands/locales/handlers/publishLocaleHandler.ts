import fs from 'fs'

import executeCommand from '@/utils/commands'
import Logging from '@/utils/logging'
import normalizePackage from '@/utils/normalizePackage'

import { validateMaintainerAccess } from '../../../utils/github-cli'
import { checkAuth, getRegistryUrl } from '../../../utils/registry'
import { validateLocaleStructure } from '../functions/validateLocaleStructure'

export async function publishLocaleHandler(
  langCode: string,
  options?: { official?: boolean }
): Promise<void> {
  const { fullName, targetDir } = normalizePackage(langCode, 'locale')

  if (!fs.existsSync(targetDir)) {
    Logging.actionableError(
      `Locale "${langCode}" not found in locales/`,
      'Run "bun forge locales list" to see available locales'
    )

    return
  }

  Logging.info('Validating locale structure...')
  validateLocaleStructure(targetDir)

  const auth = await checkAuth()

  if (options?.official) {
    Logging.info('Validating maintainer access...')
    validateMaintainerAccess(auth.username ?? '')
  }

  Logging.info(`Publishing ${Logging.highlight(fullName)}...`)

  try {
    executeCommand(`npm publish --registry ${getRegistryUrl()}`, {
      cwd: targetDir,
      stdio: 'inherit'
    })

    Logging.success(`Published ${Logging.highlight(fullName)}`)
  } catch (error) {
    Logging.actionableError(
      `Failed to publish ${Logging.highlight(fullName)}`,
      'Check if you are properly authenticated with the registry'
    )
    throw error
  }
}
