import checkDB from '@functions/database/dbUtils'
import { ensureKeysExist } from '@functions/encryption'
import { LoggingService } from '@functions/logging/loggingService'
import { setupSocket } from '@functions/socketio/setupSocket'
import traceRouteStack from '@functions/utils/traceRouteStack'
import dotenv from 'dotenv'
import fs from 'fs'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

import app from './core/app'
import { CORS_ALLOWED_ORIGINS } from './core/routes/constants/corsAllowedOrigins'

const PORT = process.env.PORT || 3636

dotenv.config({
  path: '../env/.env.local'
})

if (!process.env.MASTER_KEY) {
  LoggingService.error(
    'Please provide MASTER_KEY in your environment variables.'
  )
  process.exit(1)
}

if (!fs.existsSync('./medium')) {
  fs.mkdirSync('./medium')
}

// Initialize encryption keys (generate if not exist)
ensureKeysExist()

await checkDB()

const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin(requestOrigin, callback) {
      if (CORS_ALLOWED_ORIGINS.includes(requestOrigin || '')) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }
})

setupSocket(io)

// Bind the socket.io instance to the request object so that it can be accessed in route handlers
app.request.io = io

// Start REST API server
server.listen(PORT, () => {
  const routes = traceRouteStack(app._router.stack)

  LoggingService.debug(`Registered routes: ${routes.length}`, 'API')
  LoggingService.info(`REST API server running on port ${PORT}`, 'API')
})
