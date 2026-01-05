import fs from 'fs'
import path from 'path'

export const ROOT_DIR = import.meta.dirname.split('/tools')[0]

const GENERATED_DIR = path.join(
  import.meta.dirname.split('/tools')[0],
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
