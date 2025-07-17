import Pocketbase from "pocketbase";

import { ITaskPoolTask } from "@middlewares/taskPoolMiddleware";

declare global {
  namespace Express {
    interface Request {
      io: SocketIO.Server;
      pb: Pocketbase;
      taskPool: Record<string, ITaskPoolTask>;
    }
  }
}
