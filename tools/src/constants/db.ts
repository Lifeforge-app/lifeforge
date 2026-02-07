import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

import { getEnvVar, isDockerMode } from '@/utils/helpers'
import logger from '@/utils/logger'

import { ROOT_DIR } from './constants'

dotenv.config({
  path: path.resolve(ROOT_DIR, 'env/.env.local'),
  quiet: true
})

export const PB_DIR = path.resolve(
  getEnvVar('PB_DIR', isDockerMode() ? '' : 'database')
)

export const PB_DATA_DIR = isDockerMode()
  ? path.resolve(PB_DIR)
  : path.resolve(path.join(PB_DIR, 'pb_data'))

export const PB_MIGRATIONS_DIR = path.resolve(`${PB_DATA_DIR}/pb_migrations`)

export const PB_BINARY_PATH = path.resolve(
  process.env.PB_BINARY_PATH || `${PB_DIR}/pocketbase`
)

// Remove http:// prefix if present
export const PB_URL = getEnvVar('PB_HOST').replace(/^http:\/\//, '')

// Extract host from PB_HOST
export const [PB_HOST, PB_PORT] = PB_URL.split(':')

export const PB_KWARGS = [
  `--dir=${PB_DATA_DIR}`,
  `--migrationsDir=${PB_MIGRATIONS_DIR}`,
  '--automigrate=0',
  `--http=${PB_URL || 'localhost:8090'}`
]

// Straightaway exit if PB_DIR is not accessible (skip in Docker mode)
if (!isDockerMode()) {
  try {
    fs.accessSync(PB_DIR)
  } catch (error) {
    logger.error(`PB_DIR is not accessible: ${error}`)
    process.exit(1)
  }
}
