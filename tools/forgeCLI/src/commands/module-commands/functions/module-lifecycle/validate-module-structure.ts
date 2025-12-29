import { validateFilePaths } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

import {
  MODULE_STRUCTURE_REQUIREMENTS,
  type ModuleInstallConfig
} from '../../utils/constants'

export function validateModuleStructure(config: ModuleInstallConfig): void {
  CLILoggingService.step('Validating module structure')

  const isValid = validateFilePaths(
    MODULE_STRUCTURE_REQUIREMENTS,
    `${config.tempDir}/${config.moduleName}`
  )

  if (!isValid) {
    CLILoggingService.actionableError(
      'Invalid module structure detected',
      'Ensure the module contains a "client" directory and package.json file'
    )
    throw new Error('Invalid module structure')
  }

  CLILoggingService.success('Module structure validated')
}
