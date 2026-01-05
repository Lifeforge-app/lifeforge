import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/constants/constants'

const TOOLS_DIR = path.join(ROOT_DIR, 'tools')

/**
 * Dynamically discovered tools from the tools directory
 */
export const TOOLS_ALLOWED = Object.fromEntries(
  fs
    .readdirSync(TOOLS_DIR)
    .filter(f => fs.statSync(path.join(TOOLS_DIR, f)).isDirectory())
    .map(f => [f, `tools/${f}`])
)

export const PROJECTS = {
  shared: 'shared',
  ui: 'packages/lifeforge-ui',
  client: 'client',
  server: 'server',
  docs: 'docs',
  ...TOOLS_ALLOWED
} as const

export type ProjectType = keyof typeof PROJECTS
