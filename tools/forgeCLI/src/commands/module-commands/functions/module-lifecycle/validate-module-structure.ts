import { validateFilePaths } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

import {
  MODULE_STRUCTURE_REQUIREMENTS,
  type ModuleInstallConfig
} from '../../utils/constants'

export function validateModuleStructure(config: ModuleInstallConfig): void {
  CLILoggingService.step('Validating module structure')

  validateFilePaths(
    MODULE_STRUCTURE_REQUIREMENTS,
    `${config.tempDir}/${config.moduleName}`
  )

  CLILoggingService.success('Module structure validated')
}
