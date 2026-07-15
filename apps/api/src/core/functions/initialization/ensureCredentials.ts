import { ROOT_DIR } from '@constants'
import { ensureKeysExist } from '@functions/encryption'
import { coreLogger } from '@functions/logging'
import dotenv from 'dotenv'
import path from 'path'

export default function ensureCredentials(): void {
  dotenv.config({
    path: path.join(ROOT_DIR, 'env/.env.local'),
    quiet: true
  })

  if (!process.env.MASTER_KEY) {
    coreLogger.error('Please provide MASTER_KEY in your environment variables.')
    process.exit(1)
  }

  ensureKeysExist()
}
