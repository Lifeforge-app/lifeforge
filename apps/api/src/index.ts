import { PORT } from '@constants'
import ensureCredentials from '@functions/initialization/ensureCredentials'
import { LocaleService } from '@functions/initialization/localeService'
import {
  LOG_LEVELS,
  type LogLevel,
  coreLogger,
  createServiceLogger
} from '@functions/logging'
import createSocketServer from '@functions/socketio/createSocketServer'
import chalk from 'chalk'
import { program } from 'commander'
import dotenv from 'dotenv'
import fs from 'fs'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { checkDB } from '@lifeforge/pocketbase'
import { traceRouteStack } from '@lifeforge/server-utils'

import app from './core/app'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({
  path: path.resolve(__dirname, '../../env/.env.local'),
  quiet: true
})

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

    createServiceLogger('Route Loader').info(
      `Registered routes: ${chalk.green(routes.length)}`
    )
    createServiceLogger('Route Loader').info(
      `REST API server running on port ${chalk.green(PORT)}`
    )
  })
}

async function main(): Promise<void> {
  LocaleService.validateAndLoad()
  ensureDirectories()
  ensureCredentials()
  await checkDB()

  const server = createSocketServer(app)

  startServer(server)
}

main()
