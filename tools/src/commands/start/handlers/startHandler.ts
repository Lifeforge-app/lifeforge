import { log } from '@clack/prompts'
import chalk from 'chalk'
import type { Command } from 'commander'

import executeCommand from '@/utils/commands'
import { ROOT_DIR } from '@/utils/constants'

import { SERVICE_COMMANDS } from '../config/commands'
import SERVICES from '../constants/services'
import {
  startAllServices,
  startSingleService
} from '../functions/startServices'

/**
 * Builds (unless `--no-build`) and starts the production services. Pass a
 * service name to start only that service.
 */
export function startHandler(
  this: Command,
  service?: string,
  extraArgs: string[] = []
): void {
  // Prevent forge CLI's --tsconfig from leaking to child processes
  delete process.env.TSX_TSCONFIG_PATH

  const build = this.opts().build as boolean

  const globalOptions = this.parent?.opts<{ host?: boolean; port?: string }>()

  const host = globalOptions?.host

  const port = globalOptions?.port

  if (service && !SERVICES.includes(service)) {
    log.error(`Unknown service: ${service}. Available: ${SERVICES.join(', ')}`)
    process.exit(1)
  }

  if (build) {
    log.step(
      `Building LifeForge for production${service ? ` (${service})` : ''}...`
    )

    // Build only the core (framework packages + server/client). Installed
    // modules are already built (and cleaned) — building them would fail.
    const buildFilters = (
      service
        ? [SERVICE_COMMANDS[service]?.buildFilter]
        : Object.values(SERVICE_COMMANDS).map(config => config.buildFilter)
    ).filter((filter): filter is string => Boolean(filter))

    executeCommand(
      `pnpm exec turbo build ${buildFilters.map(filter => `--filter=${filter}`).join(' ')}`,
      { cwd: ROOT_DIR, stdio: 'inherit' }
    )
  }

  if (process.stdout.isTTY) {
    // Clear the screen (scrollback + viewport) before the service logs start.
    process.stdout.write('\x1b[2J\x1b[3J\x1b[H')
  }

  if (!service) {
    log.step('Starting production services...')
    startAllServices(host, port)

    return
  }

  log.step(`Starting ${chalk.blue(service)} service...`)

  try {
    startSingleService(service, extraArgs, host, port)
  } catch {
    log.error(`Failed to start ${chalk.blue(service)} service`)
    process.exit(1)
  }
}
