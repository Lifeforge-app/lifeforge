import { LoggingService } from '@functions/logging/loggingService'
import { setupSocket } from '@functions/socketio/setupSocket'
import checkDB from '@functions/utils/checkDB'
import traceRouteStack from '@functions/utils/traceRouteStack'
import dotenv from 'dotenv'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

import app from './core/app'

dotenv.config({
  path: './env/.env.local'
})

if (!process.env.MASTER_KEY) {
  LoggingService.error(
    'Please provide MASTER_KEY in your environment variables.'
  )
  process.exit(1)
}

await checkDB()

const server = createServer(app)

const io = new Server(server)

setupSocket(io)

// Bind the socket.io instance to the request object so that it can be accessed in route handlers
app.request.io = io

// Start REST API server
server.listen(process.env.PORT, () => {
  const routes = traceRouteStack(app._router.stack)

  LoggingService.debug(`Registered routes: ${routes.length}`, 'API')
  LoggingService.info(
    `REST API server running on port ${process.env.PORT}`,
    'API'
  )
})
