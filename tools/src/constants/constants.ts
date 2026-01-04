import fs from 'fs'
import path from 'path'

export const PROJECT_ROOT = import.meta.dirname.split('/tools')[0]

const TOOLS_DIR = path.join(PROJECT_ROOT, 'tools')

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

const GENERATED_DIR = path.join(
  import.meta.dirname.split('/tools')[0],
  'server/src/generated'
)

if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true })
}

export const SERVER_ROUTES_DIR = path.join(GENERATED_DIR, 'routes.ts')

export const SERVER_SCHEMA_DIR = path.join(GENERATED_DIR, 'schemas.ts')

export const LOCALES_DIR = path.join(PROJECT_ROOT, 'locales')

if (!fs.existsSync(LOCALES_DIR)) {
  fs.mkdirSync(LOCALES_DIR)
}
