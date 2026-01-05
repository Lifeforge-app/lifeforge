import Logging from '@/utils/logging'

import {
  startAllServices,
  startSingleService
} from '../functions/startServices'
import validateService from '../functions/validateServices'

export function devHandler(service: string, extraArgs: string[] = []): void {
  validateService(service)

  if (!service) {
    Logging.info('Starting all services...')
    startAllServices()

    return
  }

  Logging.info(`Starting ${Logging.highlight(service)} service...`)

  if (extraArgs.length > 0) {
    Logging.debug(`Extra arguments: ${extraArgs.join(' ')}`)
  }

  try {
    startSingleService(service, extraArgs)
  } catch (error) {
    Logging.actionableError(
      `Failed to start ${Logging.highlight(service)} service`,
      'Check if all required dependencies are installed and environment variables are set'
    )
    Logging.debug(`Error details: ${error}`)
    process.exit(1)
  }
}
