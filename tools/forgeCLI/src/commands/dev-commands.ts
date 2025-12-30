import concurrently from 'concurrently'
import fs from 'fs'

import { PB_BINARY_PATH, PB_KWARGS } from '@/constants/db'

import {
  PROJECTS_ALLOWED,
  TOOLS_ALLOWED,
  VALID_SERVICES
} from '../constants/constants'
import type { ConcurrentServiceConfig, ServiceType } from '../types'
import {
  checkPortInUse,
  delay,
  executeCommand,
  getEnvVars,
  killExistingProcess
} from '../utils/helpers'
import CLILoggingService from '../utils/logging'

/**
 * Service command configurations
 */
interface ServiceConfig {
  command: string | (() => Promise<string>) | (() => string)
  cwd?: string | (() => string)
  requiresEnv?: string[]
}

const SERVICE_COMMANDS: Record<string, ServiceConfig> = {
  db: {
    command: async () => {
      const killedProcess = killExistingProcess('./pocketbase serve')

      if (killedProcess) {
        await delay(2000)
      }

      if (checkPortInUse(8090)) {
        CLILoggingService.actionableError(
          'No Pocketbase instance found running, but port 8090 is already in use.',
          'Please free up the port. Are you using the port for another application? (e.g., port forwarding, etc.)'
        )
        process.exit(1)
      }

      if (!fs.existsSync(PB_BINARY_PATH)) {
        CLILoggingService.error(
          `PocketBase binary does not exist: ${PB_BINARY_PATH}`
        )
        process.exit(1)
      }

      return `${PB_BINARY_PATH} serve ${PB_KWARGS.join(' ')}`
    },
    cwd: () => process.env.PB_DIR!,
    requiresEnv: ['PB_DIR']
  },
  server: {
    command: async () => {
      const killedProcess = killExistingProcess(
        'lifeforge/server/node_modules/.bin/tsx'
      )

      if (killedProcess) {
        await delay(2000)
      }

      const PORT = process.env.PORT || '3636'

      if (checkPortInUse(Number(PORT))) {
        CLILoggingService.actionableError(
          `Port ${PORT} is already in use.`,
          'Please free up the port or set a different PORT environment variable.'
        )
        process.exit(1)
      }

      return 'bun run dev'
    },
    cwd: 'server'
  },
  docs: {
    command: () => {
      killExistingProcess('lifeforge/docs/node_modules/.bin/vite')

      return 'bun run dev'
    },
    cwd: 'docs'
  },
  client: {
    command: () => {
      killExistingProcess('lifeforge/client/node_modules/.bin/vite')

      if (!fs.existsSync('shared/dist')) {
        executeCommand('bun forge build shared')
      }

      if (!fs.existsSync('packages/lifeforge-ui/dist')) {
        executeCommand('bun forge build ui')
      }

      return 'cd client && bun run dev'
    }
  },
  ui: {
    command: () => {
      killExistingProcess(
        'lifeforge/packages/lifeforge-ui/node_modules/.bin/storybook'
      )

      return 'bun run dev'
    },
    cwd: 'packages/lifeforge-ui'
  }
}

/**
 * Creates service configurations for concurrent execution
 */
async function getConcurrentServices(): Promise<ConcurrentServiceConfig[]> {
  const SERVICES_TO_START = ['db', 'server', 'client']

  const concurrentServices: ConcurrentServiceConfig[] = []

  for (const service of SERVICES_TO_START) {
    const config = SERVICE_COMMANDS[service]

    const command =
      config.command instanceof Function
        ? await config.command()
        : config.command

    const cwd = config.cwd instanceof Function ? config.cwd() : config.cwd

    if (config.requiresEnv) {
      getEnvVars(config.requiresEnv)
    }

    concurrentServices.push({
      name: service,
      command,
      cwd
    })
  }

  return concurrentServices
}

/**
 * Starts a single service based on its configuration
 */
async function startSingleService(
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
    const projectPath =
      PROJECTS_ALLOWED[service as keyof typeof PROJECTS_ALLOWED]

    executeCommand(`cd ${projectPath} && bun run dev`, {}, extraArgs)

    return
  }

  throw new Error(`Unknown service: ${service}`)
}

/**
 * Starts all development services concurrently
 */
async function startAllServices(): Promise<void> {
  CLILoggingService.progress(
    'Starting all services: database, server, and client'
  )

  try {
    const concurrentServices = await getConcurrentServices()

    concurrently(concurrentServices, {
      killOthersOn: ['failure', 'success'],
      restartTries: 0,
      prefix: 'name',
      prefixColors: ['cyan', 'green', 'magenta']
    })
  } catch (error) {
    CLILoggingService.actionableError(
      'Failed to start all services',
      'Ensure PocketBase is properly configured and all dependencies are installed'
    )
    CLILoggingService.debug(`Error details: ${error}`)
    process.exit(1)
  }
}

/**
 * Validates if a service is valid
 */
function validateService(service: string): void {
  if (service && !VALID_SERVICES.includes(service as ServiceType)) {
    CLILoggingService.options(`Invalid service: "${service}"`, [
      ...VALID_SERVICES
    ])
    process.exit(1)
  }
}

/**
 * Main development command handler
 */
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
