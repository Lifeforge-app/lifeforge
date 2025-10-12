import chalk from 'chalk'

import { CLILoggingService } from '../../../utils/logging'
import { getInstalledModules } from '../utils/file-system'

/**
 * Handles the list modules command
 */
export async function listModulesHandler(): Promise<void> {
  const modules = getInstalledModules()

  if (modules.length === 0) {
    CLILoggingService.info('No modules installed yet.')
    return
  }

  console.log()
  CLILoggingService.info(
    `Found ${modules.length} installed module${modules.length > 1 ? 's' : ''}:`
  )
  console.log()

  modules.forEach((module, index) => {
    console.log(
      `  ${chalk.cyan((index + 1).toString().padStart(2))}. ${chalk.white(module)}`
    )
  })

  console.log()
}
