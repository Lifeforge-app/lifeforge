import { setupSocket } from '@functions/socketio/setupSocket'
import traceRouteStack from '@functions/utils/traceRouteStack'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

import app from './core/app'

const server = createServer(app)

const io = new Server(server)

setupSocket(io)

// Bind the socket.io instance to the request object so that it can be accessed in route handlers
app.request.io = io

// Start REST API server
server.listen(process.env.PORT, () => {
  const routes = traceRouteStack(app._router.stack)

  console.log(`Registered routes: ${routes.length}`)
  console.log(`REST API server running on port ${process.env.PORT}`)
})
