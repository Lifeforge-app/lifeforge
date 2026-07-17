import {
  ConvertMedia,
  MediaConfig
} from '@functions/routes/typescript/forge_controller.types'
import { ITaskPoolTask } from '@functions/socketio/taskPool'

import { PBService } from '@lifeforge/pocketbase'

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
