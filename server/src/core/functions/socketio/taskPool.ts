import {
  AddToTaskPoolFunc,
  GlobalTaskPool,
  UpdateTaskInPoolFunc
} from '@lifeforge/server-utils'
import { v4 } from 'uuid'

export const globalTaskPool: GlobalTaskPool = {}

export const addToTaskPool: AddToTaskPoolFunc = (io, taskData) => {
  const taskId = v4()

  globalTaskPool[taskId] = {
    module: taskData.module,
    description: taskData.description,
    status: taskData.status,
    data: taskData.data,
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: taskData.progress
  }

  io.emit('taskPoolUpdate', {
    taskId,
    ...globalTaskPool[taskId]
  })

  return taskId
}

export const updateTaskInPool: UpdateTaskInPoolFunc = (io, taskId, updates) => {
  if (globalTaskPool[taskId]) {
    globalTaskPool[taskId] = {
      ...globalTaskPool[taskId],
      ...updates,
      updatedAt: new Date()
    }
  }

  io.emit('taskPoolUpdate', {
    taskId,
    ...globalTaskPool[taskId]
  })

  if (updates.status === 'failed') {
    console.log(updates.error)
  }

  if (updates.status === 'completed' || updates.status === 'failed') {
    delete globalTaskPool[taskId]
  }
}
