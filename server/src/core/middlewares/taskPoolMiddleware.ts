import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import { v4 } from "uuid";

export interface ITaskPoolTask {
  module: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
  data?: any;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  progress?: number | string | Record<string, number | string>;
}

export const globalTaskPool: Record<string, ITaskPoolTask> = {};

const taskPoolMiddleware = (req: Request, _: Response, next: NextFunction) => {
  req.taskPool = globalTaskPool;
  next();
};

export const addToTaskPool = (
  io: Server,
  taskData: Pick<
    ITaskPoolTask,
    "module" | "description" | "status" | "data" | "progress"
  >,
) => {
  const taskId = v4();

  globalTaskPool[taskId] = {
    module: taskData.module,
    description: taskData.description,
    status: taskData.status,
    data: taskData.data,
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: taskData.progress,
  };

  io.emit("taskPoolUpdate", {
    taskId,
    ...globalTaskPool[taskId],
  });

  return taskId;
};

export const updateTaskInPool = (
  io: Server,
  taskId: string,
  updates: Partial<ITaskPoolTask>,
) => {
  if (globalTaskPool[taskId]) {
    globalTaskPool[taskId] = {
      ...globalTaskPool[taskId],
      ...updates,
      updatedAt: new Date(),
    };
  }

  io.emit("taskPoolUpdate", {
    taskId,
    ...globalTaskPool[taskId],
  });

  if (updates.status === "completed" || updates.status === "failed") {
    delete globalTaskPool[taskId];
  }
};

export default taskPoolMiddleware;
