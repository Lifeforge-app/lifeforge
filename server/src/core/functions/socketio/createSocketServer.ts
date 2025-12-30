import { Express } from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

import { CORS_ALLOWED_ORIGINS } from '../../routes/constants/corsAllowedOrigins'
import { setupSocket } from './setupSocket'

export default function createSocketServer(
  app: Express
): ReturnType<typeof createServer> {
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
  app.request.io = io

  return server
}
