import concurrently from 'concurrently'

import { PROJECTS, TOOLS_ALLOWED } from '@/commands/project/constants/projects'
import executeCommand from '@/utils/commands'
import { getEnvVars } from '@/utils/helpers'
import Logging from '@/utils/logging'

import { SERVICE_COMMANDS } from '../config/commands'
import getConcurrentServices from './getConcurrentServices'

/**
 * Starts a single service based on its configuration
 */
export async function startSingleService(
  service: string,
  extraArgs: string[] = []
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

    executeCommand(command, { cwd }, extraArgs)

    return
  }

  // Handle tool services
  if (service in TOOLS_ALLOWED) {
    const projectPath = PROJECTS[service as keyof typeof PROJECTS]

    executeCommand(`cd ${projectPath} && bun run dev`, {}, extraArgs)

    return
  }

  throw new Error(`Unknown service: ${service}`)
}

/**
 * Starts all development services concurrently
 */
export async function startAllServices(): Promise<void> {
  try {
    const concurrentServices = await getConcurrentServices()

    concurrently(concurrentServices, {
      killOthersOn: ['failure', 'success'],
      restartTries: 0,
      prefix: 'name',
      prefixColors: ['cyan', 'green', 'magenta']
    })
  } catch (error) {
    Logging.actionableError(
      'Failed to start all services',
      'Ensure PocketBase is properly configured and all dependencies are installed'
    )
    Logging.debug(`Error details: ${error}`)
    process.exit(1)
  }
}
