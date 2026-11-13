import { log } from '@clack/prompts'
import concurrently from 'concurrently'

import executeCommand from '@/utils/commands'
import { getEnvVars } from '@/utils/helpers'

import { SERVICE_COMMANDS } from '../config/commands'
import getConcurrentServices from './getConcurrentServices'

/**
 * Starts a single production service based on its configuration
 */
export async function startSingleService(
  service: string,
  extraArgs: string[] = [],
  host?: boolean,
  port?: string
): Promise<void> {
  // Prevent forge CLI's --tsconfig from leaking to child processes
  delete process.env.TSX_TSCONFIG_PATH

  const config = SERVICE_COMMANDS[service]

  if (!config) {
    throw new Error(`Unknown service: ${service}`)
  }

  if (config.requiresEnv) {
    getEnvVars(config.requiresEnv)
  }

  const command =
    config.command instanceof Function ? await config.command() : config.command

  const cwd = config.cwd instanceof Function ? config.cwd() : config.cwd

  // Add --host and --port flags for client service if provided
  const finalExtraArgs = [...extraArgs]

  if (service === 'client') {
    if (host) {
      finalExtraArgs.push('--host')
    }

    if (port) {
      finalExtraArgs.push('--port', port)
    }
  }

  executeCommand(command, { cwd, stdio: 'inherit' }, finalExtraArgs)
}

/**
 * Starts all production services concurrently
 */
export async function startAllServices(
  host?: boolean,
  port?: string
): Promise<void> {
  try {
    // Prevent forge CLI's --tsconfig from leaking to child processes
    delete process.env.TSX_TSCONFIG_PATH

    const concurrentServices = await getConcurrentServices(host, port)

    const { result } = concurrently(concurrentServices, {
      killOthersOn: ['failure', 'success'],
      restartTries: 0,
      prefix: 'name',
      prefixColors: ['cyan', 'green', 'magenta']
    })

    await result
  } catch {
    log.error('Failed to start all services')
    process.exit(1)
  }
}
