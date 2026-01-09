import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

import { getEnvVar, isDockerMode } from '@/utils/helpers'
import Logging from '@/utils/logging'

import { ROOT_DIR } from './constants'

dotenv.config({
  path: path.resolve(ROOT_DIR, 'env/.env.local'),
  quiet: true
})

export const PB_DIR = getEnvVar('PB_DIR', isDockerMode() ? '' : 'database')

export const PB_DATA_DIR = isDockerMode()
  ? path.resolve(PB_DIR)
  : path.resolve(path.join(PB_DIR, 'pb_data'))

export const PB_MIGRATIONS_DIR = path.resolve(`${PB_DATA_DIR}/pb_migrations`)

export const PB_BINARY_PATH = path.resolve(
  process.env.PB_BINARY_PATH || 
  `${PB_DIR}/pocketbase${process.platform === 'win32' ? '.exe' : ''}`
)

export const PB_KWARGS = [
  `--dir=${PB_DATA_DIR}`,
  `--migrationsDir=${PB_MIGRATIONS_DIR}`
]

// Straightaway exit if PB_DIR is not accessible
try {
  fs.accessSync(PB_DIR)
} catch (error) {
  Logging.error(`PB_DIR is not accessible: ${error}`)
  process.exit(1)
}
