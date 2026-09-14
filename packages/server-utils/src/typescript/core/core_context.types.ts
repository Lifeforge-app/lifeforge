import type OpenAI from 'openai'
import { Server } from 'socket.io'
import z from 'zod'

import type { FileStorage } from '@lifeforge/file-storage'
import type { Logger } from '@lifeforge/log'

import { ITempFileManagerConstructor } from './tempfile_manager.types'

export type FetchAIFunc = <
  T extends z.ZodTypeAny | undefined = undefined
>(params: {
  provider: string
  model: string
  messages: OpenAI.ChatCompletionMessageParam[]
  structure?: T
}) => Promise<(T extends z.ZodTypeAny ? z.infer<T> : string) | null>

export type SearchLocationsFunc = (
  key: string,
  q: string
) => Promise<
  {
    name: string
    formattedAddress: string
    location: { latitude: number; longitude: number }
  }[]
>

type GetAPIKeyFunc = (id: string) => Promise<string>

type CheckModulesAvailabilityFunc = (moduleIds: string) => Promise<boolean>

export type ConvertPDFToImageFunc = (path: string) => Promise<File | undefined>

export type ParseOCRFunc = (imagePath: string) => Promise<string>

export type TaskPoolTask = {
  module: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  data?: unknown
  error?: string
  createdAt: Date
  updatedAt: Date
  progress?: number | string | Record<string, number | string>
}

export type GlobalTaskPool = Record<string, TaskPoolTask>

export type AddToTaskPoolFunc = (
  io: Server,
  taskData: Pick<
    TaskPoolTask,
    'module' | 'description' | 'status' | 'data' | 'progress'
  >
) => string

export type UpdateTaskInPoolFunc = (
  io: Server,
  taskId: string,
  updates: Partial<TaskPoolTask>
) => void

export type DecryptFunc = (encrypted: Buffer, key: string) => Buffer

export type Decrypt2Func = (encrypted: string, key: string) => string

export type EncryptFunc = (data: Buffer, key: string) => Buffer

export type Encrypt2Func = (data: string, key: string) => string

export interface CoreContext<
  TSchema extends Record<string, unknown> = Record<string, unknown>
> {
  logging: Logger
  storage: FileStorage<TSchema>
  api: {
    fetchAI: FetchAIFunc
    searchLocations: SearchLocationsFunc
    getAPIKey: GetAPIKeyFunc
  }
  tempFile: ITempFileManagerConstructor
  validation: {
    checkModulesAvailability: CheckModulesAvailabilityFunc
  }
  media: {
    convertPDFToImage: ConvertPDFToImageFunc
    parseOCR: ParseOCRFunc
  }
  tasks: {
    global: GlobalTaskPool
    add: AddToTaskPoolFunc
    update: UpdateTaskInPoolFunc
  }
  crypto: {
    decrypt: DecryptFunc
    decrypt2: Decrypt2Func
    encrypt: EncryptFunc
    encrypt2: Encrypt2Func
  }
}
