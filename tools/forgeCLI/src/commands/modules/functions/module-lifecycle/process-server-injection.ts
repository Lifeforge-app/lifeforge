import CLILoggingService from '@/utils/logging'

import { hasServerComponents } from '../../utils/file-system'
import { injectModuleRoute } from '../../utils/route-injection'
import { injectModuleSchema } from '../../utils/schema-injection'

export function processServerInjection(moduleName: string): void {
  CLILoggingService.step('Checking for server components')

  const { hasServerDir, hasServerIndex } = hasServerComponents(moduleName)

  if (!hasServerDir) {
    CLILoggingService.info(
      `No server directory found - skipping server setup (UI-only module)`
    )

    return
  }

  if (!hasServerIndex) {
    CLILoggingService.info(`No server index.ts found - skipping server setup`)

    return
  }

  CLILoggingService.progress('Setting up server components')

  try {
    injectModuleRoute(moduleName)
    CLILoggingService.success('Server routes configured')
  } catch (error) {
    CLILoggingService.warn(`Failed to inject route for ${moduleName}: ${error}`)
  }

  try {
    injectModuleSchema(moduleName)
    CLILoggingService.success('Server schema configured')
  } catch (error) {
    CLILoggingService.warn(
      `Failed to inject schema for ${moduleName}: ${error}`
    )
  }
}
