import CLILoggingService from '@/utils/logging'

import {
  startAllServices,
  startSingleService
} from '../functions/startServices'
import validateService from '../functions/validateServices'

export function devHandler(service: string, extraArgs: string[] = []): void {
  validateService(service)

  if (!service) {
    startAllServices()

    return
  }

  CLILoggingService.progress(`Starting ${service} service`)

  if (extraArgs.length > 0) {
    CLILoggingService.debug(`Extra arguments: ${extraArgs.join(' ')}`)
  }

  try {
    startSingleService(service, extraArgs)
  } catch (error) {
    CLILoggingService.actionableError(
      `Failed to start ${service} service`,
      'Check if all required dependencies are installed and environment variables are set'
    )
    CLILoggingService.debug(`Error details: ${error}`)
    process.exit(1)
  }
}
