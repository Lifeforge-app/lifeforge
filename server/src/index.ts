import fs from 'fs'
import { createServer } from 'node:http'

import checkDB from '@functions/database/dbUtils'
import ensureCredentials from '@functions/initialization/ensureCredentials'
import { LocaleService } from '@functions/initialization/localeService'
import traceRouteStack from '@functions/initialization/traceRouteStack'
import updateLocaleSubmodules from '@functions/initialization/updateLocaleSubmodules'
import { LoggingService } from '@functions/logging/loggingService'
import createSocketServer from '@functions/socketio/createSocketServer'
import ensureRootName from '@functions/utils/ensureRootName'

import app from './core/app'

const PORT = process.env.PORT || 3636

function ensureDirectories(): void {
  if (!fs.existsSync('./medium')) {
    fs.mkdirSync('./medium')
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
  updateLocaleSubmodules()
  LocaleService.validateAndLoad()
  ensureRootName()
  ensureDirectories()
  ensureCredentials()
  await checkDB()

  const server = createSocketServer(app)

  startServer(server)
}

main()
