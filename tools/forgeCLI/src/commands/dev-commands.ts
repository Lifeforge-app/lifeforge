import concurrently from 'concurrently'

import {
  PROJECTS_ALLOWED,
  TOOLS_ALLOWED,
  VALID_SERVICES
} from '../constants/constants'
import type { ConcurrentServiceConfig, ServiceType } from '../types'
import {
  executeCommand,
  killExistingProcess,
  validateEnvironment
} from '../utils/helpers'
import { CLILoggingService } from '../utils/logging'

/**
 * Service command configurations
 */
interface ServiceConfig {
  command: string | (() => string)
  cwd?: () => string | undefined
  requiresEnv?: string[]
}

const SERVICE_COMMANDS: Record<string, ServiceConfig> = {
  db: {
    command: './pocketbase serve',
    cwd: () => process.env.PB_DIR,
    requiresEnv: ['PB_DIR']
  },
  server: {
    command: () => {
      killExistingProcess('lifeforge/node_modules/.bin/tsx')

      return 'cd server && bun run dev'
    }
  },
  client: {
    command: () => {
      killExistingProcess('lifeforge/node_modules/.bin/vite')

      return 'cd client && bun run dev'
    }
  },
  ui: {
    command: () => {
      killExistingProcess('lifeforge/node_modules/.bin/storybook')

      return 'cd packages/lifeforge-ui && bun run dev'
    }
  }
}

/**
 * Creates service configurations for concurrent execution
 */
const createConcurrentServices = (): ConcurrentServiceConfig<
  string | (() => string)
>[] => [
  {
    name: 'db',
    command: SERVICE_COMMANDS.db.command,
    cwd: SERVICE_COMMANDS.db.cwd?.()
  },
  {
    name: 'server',
    command: SERVICE_COMMANDS.server.command
  },
  {
    name: 'client',
    command: SERVICE_COMMANDS.client.command
  }
]

/**
 * Starts a single service based on its configuration
 */
function startSingleService(service: string): void {
  // Handle core services
  if (service in SERVICE_COMMANDS) {
    const config = SERVICE_COMMANDS[service]

    if (config.requiresEnv) {
      validateEnvironment(config.requiresEnv)
    }

    executeCommand(config.command, {
      cwd: config.cwd?.()
    })

    return
  }

  // Handle tool services
  if (service in TOOLS_ALLOWED) {
    const projectPath =
      PROJECTS_ALLOWED[service as keyof typeof PROJECTS_ALLOWED]

    executeCommand(`cd ${projectPath} && bun run dev`)

    return
  }

  throw new Error(`Unknown service: ${service}`)
}

/**
 * Starts all development services concurrently
 */
function startAllServices(): void {
  validateEnvironment(['PB_DIR'])
  CLILoggingService.progress(
    'Starting all services: database, server, and client'
  )

  try {
    const services = createConcurrentServices()

    services.forEach(service => {
      if (typeof service.command === 'function') {
        service.command = service.command()
      }
    })

    concurrently(services as ConcurrentServiceConfig[], {
      killOthers: ['failure', 'success'],
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
  if (!VALID_SERVICES.includes(service as ServiceType)) {
    CLILoggingService.options(`Invalid service: "${service}"`, [
      ...VALID_SERVICES
    ])
    process.exit(1)
  }
}

/**
 * Main development command handler
 */
export function devHandler(service: string): void {
  validateService(service)

  if (service === 'all') {
    startAllServices()

    return
  }

  CLILoggingService.progress(`Starting ${service} service`)

  try {
    startSingleService(service)
  } catch (error) {
    CLILoggingService.actionableError(
      `Failed to start ${service} service`,
      'Check if all required dependencies are installed and environment variables are set'
    )
    CLILoggingService.debug(`Error details: ${error}`)
    process.exit(1)
  }
}

/**
 * Gets the list of available services
 */
export function getAvailableServices(): readonly ServiceType[] {
  return VALID_SERVICES
}
