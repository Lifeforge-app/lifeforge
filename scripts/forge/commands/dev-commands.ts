import concurrently from 'concurrently'

import {
  PROJECTS_ALLOWED,
  TOOLS_ALLOWED,
  VALID_SERVICES
} from '../constants/constants'
import type { ConcurrentServiceConfig, ServiceType } from '../types'
import { executeCommand, validateEnvironment } from '../utils/helpers'

/**
 * Service command configurations
 */
interface ServiceConfig {
  command: string
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
    command: 'cd server && bun run dev'
  },
  client: {
    command: 'cd client && bun run dev'
  },
  ui: {
    command: 'cd packages/lifeforge-ui && bun run dev'
  }
}

/**
 * Creates service configurations for concurrent execution
 */
const createConcurrentServices = (): ConcurrentServiceConfig[] => [
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
  console.log('🚀 Starting all services: db, server, client...')

  try {
    const services = createConcurrentServices()

    concurrently(services, {
      killOthers: ['failure', 'success'],
      restartTries: 3,
      prefix: 'name',
      prefixColors: ['cyan', 'green', 'magenta']
    })
  } catch (error) {
    console.error('❌ Failed to start all services.')
    console.error(error)
    process.exit(1)
  }
}

/**
 * Validates if a service is valid
 */
function validateService(service: string): void {
  if (!VALID_SERVICES.includes(service as any)) {
    console.error(`❌ Invalid service: ${service}`)
    console.error(`Available services: ${VALID_SERVICES.join(', ')}`)
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

  console.log(`🚀 Starting service: ${service}...`)

  try {
    startSingleService(service)
  } catch (error) {
    console.error(`❌ Failed to start service: ${service}`)
    console.error(error)
    process.exit(1)
  }
}

/**
 * Gets the list of available services
 */
export function getAvailableServices(): readonly ServiceType[] {
  return VALID_SERVICES
}
