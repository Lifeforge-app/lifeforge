import chalk from 'chalk'

import logger from '@/utils/logger'

import SERVICES from '../constants/services'
import {
  startAllServices,
  startSingleService
} from '../functions/startServices'

export function devHandler(service: string, extraArgs: string[] = []): void {
  if (!service) {
    logger.info('Starting all services...')
    startAllServices()

    return
  }

  if (!SERVICES.includes(service as (typeof SERVICES)[number])) {
    logger.error(`Unknown service: ${service}`)
    process.exit(1)
  }

  logger.info(`Starting ${chalk.blue(service)} service...`)

  if (extraArgs.length > 0) {
    logger.debug(`Extra arguments: ${extraArgs.join(' ')}`)
  }

  try {
    startSingleService(service, extraArgs)
  } catch (error) {
    logger.error(`Failed to start ${chalk.blue(service)} service`)
    logger.debug(`Error details: ${error}`)
    process.exit(1)
  }
}
