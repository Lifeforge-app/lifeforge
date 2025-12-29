import CLILoggingService from '@/utils/logging'

import { removeModuleRoute } from '../../utils/route-injection'
import { removeModuleSchema } from '../../utils/schema-injection'

export function removeServerReferences(moduleName: string): void {
  CLILoggingService.progress('Removing server references')

  try {
    removeModuleRoute(moduleName)
    CLILoggingService.success('Server routes removed')
  } catch (error) {
    CLILoggingService.warn(`Failed to remove route for ${moduleName}: ${error}`)
  }

  try {
    removeModuleSchema(moduleName)
    CLILoggingService.success('Server schema references removed')
  } catch (error) {
    CLILoggingService.warn(
      `Failed to remove schema for ${moduleName}: ${error}`
    )
  }
}
