import traceRouteStack from '@functions/traceRouteStack'
import { globalTaskPool } from '@middlewares/taskPoolMiddleware'
import { createServer } from 'node:http'
import Pocketbase from 'pocketbase'
import { Server } from 'socket.io'

import app from './core/app'

const server = createServer(app)

const io = new Server(server)

io.use(async (socket, next) => {
  const bearerToken = socket.handshake.auth.token as string

  const pb = new Pocketbase(process.env.PB_HOST)

  if (!bearerToken) {
    next(new Error('Authorization token is required'))

    return
  }

  try {
    pb.authStore.save(bearerToken, null)

    try {
      await pb.collection('users').authRefresh()
    } catch (error: any) {
      if (error.response.code === 401) {
        next(new Error('Invalid authorization credentials'))

        return
      }
    }
    next()
  } catch {
    next(new Error('Internal server error'))
  }
})

io.on('connection', socket => {
  console.log('a user connected')

  for (const task in globalTaskPool) {
    const taskData = globalTaskPool[task]

    socket.emit('taskPoolUpdate', {
      taskId: task,
      ...taskData
    })
  }
})

app.request.io = io

// Start REST API server
server.listen(process.env.PORT, () => {
  const routes = traceRouteStack(app._router.stack)

  console.log(`Registered routes: ${routes.length}`)
  console.log(`REST API server running on port ${process.env.PORT}`)
})
