import { log } from '@clack/prompts'
import chalk from 'chalk'
import type { Command } from 'commander'

import SERVICES from '../constants/services'
import {
  startAllServices,
  startSingleService
} from '../functions/startServices'

export function devHandler(
  this: Command,
  service: string,
  extraArgs: string[] = []
): void {
  const options = this.parent?.opts()

  const host = options?.host

  const port = options?.port

  if (!service) {
    log.step('Starting all services...')
    startAllServices(host, port)

    return
  }

  if (!SERVICES.includes(service as (typeof SERVICES)[number])) {
    log.error(`Unknown service: ${service}`)
    process.exit(1)
  }

  log.step(`Starting ${chalk.blue(service)} service...`)

  try {
    startSingleService(service, extraArgs, host, port)
  } catch {
    log.error(`Failed to start ${chalk.blue(service)} service`)
    process.exit(1)
  }
}
