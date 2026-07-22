import { globalTaskPool } from '@functions/socketio/taskPool'
import jwt from 'jsonwebtoken'
import { Server } from 'socket.io'

const JWT_SECRET = process.env.JWT_SIGNING_KEY!

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

    if (!bearerToken) {
      next(new Error('Authorization token is required'))

      return
    }

    try {
      jwt.verify(bearerToken, JWT_SECRET, { algorithms: ['HS512'] })
      next()
    } catch {
      next(new Error('Invalid authorization credentials'))
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
