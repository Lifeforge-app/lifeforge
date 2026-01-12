import { PORT } from '@constants'
import chalk from 'chalk'
import { program } from 'commander'
import fs from 'fs'
import { createServer } from 'node:http'

import checkDB from '@functions/database/dbUtils'
import ensureCredentials from '@functions/initialization/ensureCredentials'
import { LocaleService } from '@functions/initialization/localeService'
import traceRouteStack from '@functions/initialization/traceRouteStack'
import { LOG_LEVELS, type LogLevel, coreLogger } from '@functions/logging'
import createSocketServer from '@functions/socketio/createSocketServer'
import ensureRootName from '@functions/utils/ensureRootName'

import app from './core/app'

// Parse CLI arguments
program
  .name('lifeforge-server')
  .description('LifeForge API Server')
  .option(
    '-l, --log-level <level>',
    `Set log level (${LOG_LEVELS.join(', ')})`,
    'info'
  )
  .parse()

const opts = program.opts<{ logLevel: string }>()

if (opts.logLevel) {
  const level = opts.logLevel.toLowerCase()

  if (LOG_LEVELS.includes(level as LogLevel)) {
    coreLogger.setLevel(level as LogLevel)
  } else {
    console.error(
      `Invalid log level: ${opts.logLevel}. Valid levels: ${LOG_LEVELS.join(', ')}`
    )
    process.exit(1)
  }
}

function ensureDirectories(): void {
  if (!fs.existsSync('./medium')) {
    fs.mkdirSync('./medium')
  }
}

function startServer(server: ReturnType<typeof createServer>): void {
  server.listen(PORT, () => {
    const routes = traceRouteStack(app._router.stack)

    coreLogger.info(`Registered routes: ${chalk.green(routes.length)}`)
    coreLogger.info(`REST API server running on port ${chalk.green(PORT)}`)
  })
}

async function main(): Promise<void> {
  LocaleService.validateAndLoad()
  ensureRootName()
  ensureDirectories()
  ensureCredentials()
  await checkDB()

  const server = createSocketServer(app)

  startServer(server)
}

main()
