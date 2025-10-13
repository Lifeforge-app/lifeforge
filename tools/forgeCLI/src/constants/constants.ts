import fs from 'fs'
import path from 'path'

/**
 * Directory containing all tools
 */
export const TOOLS_DIR = path.join(__dirname, '../../../../tools')

/**
 * Dynamically discovered tools from the tools directory
 */
export const TOOLS_ALLOWED = Object.fromEntries(
  fs
    .readdirSync(TOOLS_DIR)
    .filter(f => fs.statSync(path.join(TOOLS_DIR, f)).isDirectory())
    .map(f => [f, `tools/${f}`])
)

/**
 * All available projects including core packages and tools
 */
export const PROJECTS_ALLOWED = {
  shared: 'shared',
  ui: 'packages/lifeforge-ui',
  client: 'client',
  server: 'server',
  ...TOOLS_ALLOWED
} as const

/**
 * Valid services that can be started in development mode
 */
export const VALID_SERVICES = [
  'all',
  'db',
  'server',
  'client',
  'ui',
  ...Object.keys(TOOLS_ALLOWED)
] as const

/**
 * Valid command types for project operations
 */
export const VALID_COMMANDS = ['build', 'types', 'lint'] as const

export type ProjectType = keyof typeof PROJECTS_ALLOWED

export type ServiceType = (typeof VALID_SERVICES)[number]

export type CommandType = (typeof VALID_COMMANDS)[number]
