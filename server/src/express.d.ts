import { PBService } from '@functions/database'
import { ITaskPoolTask } from '@middlewares/taskPoolMiddleware'

declare global {
  namespace Express {
    interface Request {
      io: SocketIO.Server
      pb: PBService
      taskPool: Record<string, ITaskPoolTask>
    }
  }
}
