import chalk from 'chalk'
import concurrently from 'concurrently'

import { PROJECTS } from '@/commands/project/constants/projects'
import executeCommand from '@/utils/commands'
import { getEnvVars } from '@/utils/helpers'
import logger from '@/utils/logger'

import { SERVICE_COMMANDS } from '../config/commands'
import getConcurrentServices from './getConcurrentServices'

/**
 * Starts a single service based on its configuration
 */
export async function startSingleService(
  service: string,
  extraArgs: string[] = [],
  host?: boolean,
  port?: string
): Promise<void> {
  // Handle core services
  if (service in SERVICE_COMMANDS) {
    const config = SERVICE_COMMANDS[service]

    if (config.requiresEnv) {
      getEnvVars(config.requiresEnv)
    }

    const command =
      config.command instanceof Function
        ? await config.command()
        : config.command

    const cwd = config.cwd instanceof Function ? config.cwd() : config.cwd

    logger.debug(`Current Working Directory: ${chalk.blue(cwd)}`)

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

    return
  }

  // Handle tool services
  if (service in PROJECTS) {
    const projectPath = PROJECTS[service as keyof typeof PROJECTS]

    executeCommand(`cd ${projectPath} && bun run dev`, {}, extraArgs)

    return
  }

  throw new Error(`Unknown service: ${service}`)
}

/**
 * Starts all development services concurrently
 */
export async function startAllServices(
  host?: boolean,
  port?: string
): Promise<void> {
  try {
    const concurrentServices = await getConcurrentServices(host, port)

    const { result } = concurrently(concurrentServices, {
      killOthersOn: ['failure', 'success'],
      restartTries: 0,
      prefix: 'name',
      prefixColors: ['cyan', 'green', 'magenta']
    })

    await result
  } catch (error) {
    logger.error('Failed to start all services')
    logger.debug(`Error details: ${error}`)
    process.exit(1)
  }
}
