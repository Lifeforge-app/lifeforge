import PocketBaseCRUDActions from '@functions/PocketBaseCRUDActions'
import { ITaskPoolTask } from '@middlewares/taskPoolMiddleware'

declare global {
  namespace Express {
    interface Request {
      io: SocketIO.Server
      pb: PocketBaseCRUDActions
      taskPool: Record<string, ITaskPoolTask>
    }
  }
}
