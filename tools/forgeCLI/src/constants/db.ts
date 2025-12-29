import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

import { getEnvVars, isDockerMode } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

dotenv.config({
  path: path.resolve(process.cwd(), 'env/.env.local'),
  quiet: true
})

if (!isDockerMode()) {
  getEnvVars(['PB_DIR'])
}

export const PB_DIR = process.env.PB_DIR || ''

export const PB_DATA_DIR = isDockerMode()
  ? path.resolve(PB_DIR)
  : path.resolve(path.join(PB_DIR, 'pb_data'))

export const PB_MIGRATIONS_DIR = path.resolve(`${PB_DATA_DIR}/pb_migrations`)

export const PB_BINARY_PATH = path.resolve(
  process.env.PB_BINARY_PATH || `${PB_DIR}/pocketbase`
)

export const PB_KWARGS = [
  `--dir=${PB_DATA_DIR}`,
  `--migrationsDir=${PB_MIGRATIONS_DIR}`
]

// Straightaway exit if PB_DIR is not accessible
try {
  fs.accessSync(PB_DIR)
} catch (error) {
  CLILoggingService.error(`PB_DIR is not accessible: ${error}`)
  process.exit(1)
}
