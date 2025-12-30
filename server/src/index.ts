import dotenv from 'dotenv'
import fs from 'fs'
import { createServer } from 'node:http'

import checkDB from '@functions/database/dbUtils'
import { ensureKeysExist } from '@functions/encryption'
import { LoggingService } from '@functions/logging/loggingService'
import createSocketServer from '@functions/socketio/createSocketServer'
import ensureRootName from '@functions/utils/ensureRootName'
import initRouteAndSchemaFiles from '@functions/utils/initRouteAndSchemaFiles'
import traceRouteStack from '@functions/utils/traceRouteStack'

import app from './core/app'

const PORT = process.env.PORT || 3636

function loadEnv(): void {
  dotenv.config({ path: '../env/.env.local' })
}

function ensureDirectories(): void {
  if (!fs.existsSync('./medium')) {
    fs.mkdirSync('./medium')
  }
}

function ensureMasterKey(): void {
  if (!process.env.MASTER_KEY) {
    LoggingService.error(
      'Please provide MASTER_KEY in your environment variables.'
    )
    process.exit(1)
  }
}

function startServer(server: ReturnType<typeof createServer>): void {
  server.listen(PORT, () => {
    const routes = traceRouteStack(app._router.stack)

    LoggingService.debug(`Registered routes: ${routes.length}`, 'API')
    LoggingService.info(`REST API server running on port ${PORT}`, 'API')
  })
}

async function main(): Promise<void> {
  loadEnv()
  ensureRootName()
  initRouteAndSchemaFiles()
  ensureDirectories()
  ensureKeysExist()
  ensureMasterKey()
  await checkDB()

  const server = createSocketServer(app)

  startServer(server)
}

main()
