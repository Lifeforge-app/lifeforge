import { PBService } from '@functions/database'
import {
  ConvertMedia,
  MediaConfig
} from '@functions/routes/typescript/forge_controller.types'
import { ITaskPoolTask } from '@functions/socketio/taskPool'

declare global {
  namespace Express {
    interface Request {
      io: SocketIO.Server
      pb: (module: { id: string }) => PBService
      taskPool: Record<string, ITaskPoolTask>
      media?: ConvertMedia<MediaConfig>
    }
  }
}
