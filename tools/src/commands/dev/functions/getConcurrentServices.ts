import { getEnvVars } from '@/utils/helpers'

import { SERVICE_COMMANDS } from '../config/commands'

interface ConcurrentServiceConfig<T extends string | (() => string) = string> {
  name: string
  command: T
  cwd?: string
  color?: string
}

/**
 * Creates service configurations for concurrent execution
 */
export default async function getConcurrentServices(
  host?: boolean,
  port?: string
): Promise<ConcurrentServiceConfig[]> {
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

    // Add --host and --port flags for client service if provided
    let finalCommand = command

    if (service === 'client') {
      const args = []

      if (host) {
        args.push('--host')
      }

      if (port) {
        args.push('--port', port)
      }
	  
      if (args.length > 0) {
        finalCommand = `${command} ${args.join(' ')}`
      }
    }

    concurrentServices.push({
      name: service,
      command: finalCommand,
      cwd
    })
  }

  return concurrentServices
}
