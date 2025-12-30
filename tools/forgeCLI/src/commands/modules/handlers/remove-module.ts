import CLILoggingService from '@/utils/logging'

import { removeModuleMigrations } from '../functions/migrations'
import {
  removeModuleDirectory,
  removeServerReferences
} from '../functions/module-lifecycle'
import { selectModuleToRemove } from '../functions/prompts'
import { moduleExists } from '../utils/file-system'

export async function removeModuleHandler(moduleName?: string): Promise<void> {
  CLILoggingService.step('Starting module removal process')

  if (!moduleName) {
    moduleName = await selectModuleToRemove()
  }

  if (!moduleExists(moduleName)) {
    CLILoggingService.actionableError(
      `Module "${moduleName}" does not exist in workspace`,
      'Use "bun forge module list" to see available modules'
    )
    process.exit(1)
  }

  CLILoggingService.step(`Removing module: ${moduleName}`)

  try {
    removeServerReferences(moduleName)

    await removeModuleMigrations(moduleName)

    removeModuleDirectory(moduleName)

    CLILoggingService.success(`Module "${moduleName}" removed successfully`)
    CLILoggingService.info(
      'Restart the system with "bun forge dev all" to see the changes'
    )
  } catch (error) {
    CLILoggingService.actionableError(
      'Module removal failed',
      'Check the error details above and ensure you have proper file permissions'
    )
    CLILoggingService.debug(`Removal error: ${error}`)
    process.exit(1)
  }
}
