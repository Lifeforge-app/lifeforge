import {
  ConvertMedia,
  MediaConfig
} from '@functions/routes/typescript/forge_controller.types'
import { ITaskPoolTask } from '@functions/socketio/taskPool'

import { type PostgresJsDatabase } from '@lifeforge/drizzle'

declare global {
  namespace Express {
    interface Request {
      io: SocketIO.Server
      db: PostgresJsDatabase
      taskPool: Record<string, ITaskPoolTask>
      media?: ConvertMedia<MediaConfig>
    }
  }
}
