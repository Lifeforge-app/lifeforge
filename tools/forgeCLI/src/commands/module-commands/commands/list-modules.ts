import { CLILoggingService } from '../../../utils/logging'
import { getInstalledModules } from '../utils/file-system'

/**
 * Handles the list modules command
 */
export async function listModulesHandler(): Promise<void> {
  const modules = getInstalledModules()

  if (modules.length === 0) {
    CLILoggingService.info('No modules installed yet')

    return
  }

  CLILoggingService.list(
    `Found ${modules.length} installed module${modules.length > 1 ? 's' : ''}:`,
    modules
  )
}
