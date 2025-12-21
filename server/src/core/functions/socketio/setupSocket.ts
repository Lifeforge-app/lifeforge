import Pocketbase from 'pocketbase'
import { Server } from 'socket.io'

import { globalTaskPool } from '@functions/socketio/taskPool'

export function setupSocket(io: Server) {
  // QR Login namespace - no authentication required
  // This allows unauthenticated desktop clients to listen for login approval
  const qrLoginNamespace = io.of('/qr-login')

  qrLoginNamespace.on('connection', socket => {
    // Join a QR session room
    socket.on('joinQRSession', (sessionId: string) => {
      // Validate sessionId format (UUID)
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

      if (!uuidRegex.test(sessionId)) {
        socket.emit('error', { message: 'Invalid session ID format' })

        return
      }

      socket.join(`qr-session:${sessionId}`)
      socket.emit('joinedQRSession', { sessionId })
    })

    // Leave a QR session room
    socket.on('leaveQRSession', (sessionId: string) => {
      socket.leave(`qr-session:${sessionId}`)
    })
  })

  // Main namespace - authenticated connections only
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
