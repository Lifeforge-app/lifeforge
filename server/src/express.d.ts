import { PBService } from '@functions/database'
import { ITaskPoolTask } from '@functions/socketio/taskPool'

declare global {
  namespace Express {
    interface Request {
      io: SocketIO.Server
      pb: PBService
      taskPool: Record<string, ITaskPoolTask>
    }
  }
}
