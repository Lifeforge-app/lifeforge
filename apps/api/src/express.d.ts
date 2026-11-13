import type { ITaskPoolTask } from '@functions/socketio/taskPool'
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js'

import type { ConvertMedia, MediaConfig } from '@lifeforge/server-utils'

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
