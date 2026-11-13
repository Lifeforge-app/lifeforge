/**
 * Service command configurations for production mode.
 */
interface ServiceConfig {
  command: string | (() => Promise<string>) | (() => string)
  cwd?: string | (() => string)
  /** Turbo package filter used to build this service. */
  buildFilter?: string
  requiresEnv?: string[]
}

export const SERVICE_COMMANDS: Record<string, ServiceConfig> = {
  server: {
    command: 'pnpm run start:prod',
    cwd: 'apps/api',
    buildFilter: '@lifeforge/server'
  },
  client: {
    command: 'pnpm run preview',
    cwd: 'apps/web',
    buildFilter: '@lifeforge/client'
  }
}
