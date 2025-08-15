import { globalTaskPool } from '@functions/socketio/taskPool'
import Pocketbase from 'pocketbase'
import { Server } from 'socket.io'

export function setupSocket(io: Server) {
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
    for (const task in globalTaskPool) {
      const taskData = globalTaskPool[task]

      socket.emit('taskPoolUpdate', {
        taskId: task,
        ...taskData
      })
    }
  })
}
