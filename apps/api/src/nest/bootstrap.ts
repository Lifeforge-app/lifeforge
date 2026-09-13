import { ROOT_DIR } from '@constants'
import ensureCredentials from '@functions/initialization/ensureCredentials'
import { LocaleService } from '@functions/initialization/localeService'
import dotenv from 'dotenv'
import type { Express } from 'express'
import fs from 'node:fs'
import type { Server as HttpServer } from 'node:http'
import path from 'node:path'

import { checkDB } from '@lifeforge/pocketbase'

const TEST_PORT = 13636

type NestApplication = {
  close(): Promise<unknown>
  init(): Promise<unknown>
  getHttpAdapter(): { getInstance(): unknown }
}

type BootstrapRuntime = {
  expressApp: Express
  nestApp: NestApplication
  server: HttpServer
}

function ensureDirectories(): void {
  if (!fs.existsSync('./medium')) {
    fs.mkdirSync('./medium')
  }
}

function listen(server: HttpServer): Promise<void> {
  return new Promise((resolve, reject) => {
    const onError = (error: Error) => {
      server.off('listening', onListening)
      reject(error)
    }
    const onListening = () => {
      server.off('error', onError)
      resolve()
    }

    server.once('error', onError)
    server.once('listening', onListening)
    server.listen(TEST_PORT)
  })
}

function closeServer(server: HttpServer): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close(error => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

export async function bootstrap(): Promise<BootstrapRuntime> {
  dotenv.config({
    path: path.join(ROOT_DIR, 'env/.env.local'),
    quiet: true
  })
  console.log('[nest-bootstrap] env-loaded')

  const { default: expressApp } = await import('../core/app')
  console.log('[nest-bootstrap] express-imported')

  LocaleService.validateAndLoad()
  ensureDirectories()
  ensureCredentials()
  await checkDB()

  const nestCorePackage = '@nestjs/core'
  const nestPlatformExpressPackage = '@nestjs/platform-express'
  const reflectMetadataPackage = 'reflect-metadata'
  const [{ NestFactory }, { ExpressAdapter }] = await Promise.all([
    import(nestCorePackage),
    import(nestPlatformExpressPackage),
    import(reflectMetadataPackage)
  ])
  const { createAppModule } = await import('./app.module')
  const AppModule = await createAppModule()
  const adapter = new ExpressAdapter()
  adapter.setNotFoundHandler = () => adapter
  const nestApp = (await NestFactory.create(AppModule, adapter, {
    bodyParser: false,
    logger: false
  })) as NestApplication
  await nestApp.init()

  const nestExpress = adapter.getInstance() as Express
  nestExpress.use('/api', expressApp)
  nestExpress.use(expressApp)

  const { default: createSocketServer } =
    await import('@functions/socketio/createSocketServer')
  const server = createSocketServer(nestExpress)
  await listen(server)
  console.log(`[nest-bootstrap] listening ${TEST_PORT}`)

  return { expressApp, nestApp, server }
}

export async function closeBootstrap({
  nestApp,
  server
}: BootstrapRuntime): Promise<void> {
  await closeServer(server)
  await nestApp.close()
}

if (import.meta.main) {
  const runtime = await bootstrap()
  const shutdown = async () => {
    await closeBootstrap(runtime)
    process.exit(0)
  }

  process.once('SIGINT', shutdown)
  process.once('SIGTERM', shutdown)
}
