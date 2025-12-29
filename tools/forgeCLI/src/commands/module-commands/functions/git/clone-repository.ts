import fs from 'fs'

import { executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

import type { ModuleInstallConfig } from '../../utils/constants'

export function cloneModuleRepository(config: ModuleInstallConfig): void {
  if (!fs.existsSync('.gitmodules')) {
    fs.writeFileSync('.gitmodules', '')
  }

  CLILoggingService.progress('Cloning module repository from GitHub')

  try {
    executeCommand(
      `git submodule add --force ${config.repoUrl} ${config.tempDir}/${config.moduleName}`,
      {
        exitOnError: false,
        stdio: ['ignore', 'ignore', 'ignore']
      }
    )

    CLILoggingService.success('Repository cloned successfully')
  } catch (error) {
    CLILoggingService.actionableError(
      'Failed to clone module repository',
      'Verify the repository URL is correct and accessible, or check your internet connection'
    )
    throw error
  }
}
