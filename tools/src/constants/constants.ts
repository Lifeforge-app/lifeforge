import fs from 'fs'
import path from 'path'

export const ROOT_DIR = path.resolve(import.meta.dirname, '../../..')

const GENERATED_DIR = path.join(
  ROOT_DIR,
  'server/src/generated'
)

export const SERVER_ROUTES_DIR = path.join(GENERATED_DIR, 'routes.ts')

export const SERVER_SCHEMA_DIR = path.join(GENERATED_DIR, 'schemas.ts')

export const LOCALES_DIR = path.join(ROOT_DIR, 'locales')

if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true })
}

if (!fs.existsSync(LOCALES_DIR)) {
  fs.mkdirSync(LOCALES_DIR)
}
