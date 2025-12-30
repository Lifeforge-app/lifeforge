import { execSync } from 'child_process'
import path from 'path'

import { LoggingService } from '../logging/loggingService'

/**
 * Updates all language pack submodules in the locales directory
 */
export default function updateLocaleSubmodules(): void {
  const rootDir = path.resolve(import.meta.dirname.split('server')[0])

  try {
    LoggingService.info('Updating language pack submodules...', 'LOCALES')

    execSync('git submodule update --init --remote --recursive -- locales', {
      cwd: rootDir,
      stdio: 'pipe'
    })

    LoggingService.info(
      'Language pack submodules updated successfully',
      'LOCALES'
    )
  } catch (error) {
    LoggingService.warn(
      `Failed to update language pack submodules: ${error}`,
      'LOCALES'
    )
  }
}
