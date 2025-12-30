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

export const LOG_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'] as const

export const AVAILABLE_TEMPLATE_MODULE_TYPES = {
  'bare-bones': 'Minimal setup with basic structure',
  'with-crud': 'Full CRUD operations ready',
  'with-routes': 'Multiple routes and navigation',
  'client-only': 'Client-side only functionality',
  widget: 'Standalone widget component'
} as const
