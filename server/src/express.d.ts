import { ITaskPoolTask } from '@middlewares/taskPoolMiddleware'
import Pocketbase from 'pocketbase'

declare global {
  namespace Express {
    interface Request {
      io: SocketIO.Server
      pb: Pocketbase
      taskPool: Record<string, ITaskPoolTask>
    }
  }
}
