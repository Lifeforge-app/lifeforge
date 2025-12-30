import { type PathConfig, validateFilePaths } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

import { type ModuleInstallConfig } from '../../utils/constants'

const MODULE_STRUCTURE_REQUIREMENTS: PathConfig[] = [
  {
    path: 'client',
    type: 'directory'
  },
  {
    path: 'package.json',
    type: 'file'
  },
  {
    path: 'manifest.ts',
    type: 'file'
  },
  {
    path: 'locales',
    type: 'directory'
  },
  {
    path: 'tsconfig.json',
    type: 'file'
  }
]

export function validateModuleStructure(config: ModuleInstallConfig): void {
  CLILoggingService.step('Validating module structure')

  validateFilePaths(
    MODULE_STRUCTURE_REQUIREMENTS,
    `${config.tempDir}/${config.moduleName}`
  )

  CLILoggingService.success('Module structure validated')
}
