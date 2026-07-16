import type OpenAI from 'openai'
import { Server } from 'socket.io'
import z from 'zod'

import type { Logger } from '@lifeforge/log'

import {
  type CleanedSchemas,
  type IPBService,
  type CollectionKey
} from '@lifeforge/pocketbase'
import { ITempFileManagerConstructor } from './tempfile_manager.types'

export type FetchAIFunc = <
  T extends z.ZodTypeAny | undefined = undefined
>(params: {
  pb: IPBService<any>
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

type CheckExistenceFunc = <TSchemas extends CleanedSchemas>(
  pb: IPBService<TSchemas>,
  collection: CollectionKey<TSchemas>,
  id: string
) => Promise<boolean>

type GetAPIKeyFunc = (id: string, pb: IPBService<any>) => Promise<string>

type CheckModulesAvailabilityFunc = (moduleIds: string) => Promise<boolean>

type FileResult<TFieldName extends string> =
  {} | { [K in TFieldName]: File | null | undefined }

export type RetrieveMediaFunc = <TFieldName extends string = string>(
  fieldName: TFieldName,
  media: string | Express.Multer.File | undefined
) => Promise<FileResult<TFieldName>>

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

export interface CoreContext {
  logging: Logger
  api: {
    fetchAI: FetchAIFunc
    searchLocations: SearchLocationsFunc
    getAPIKey: GetAPIKeyFunc
  }
  tempFile: ITempFileManagerConstructor
  validation: {
    checkRecordExistence: CheckExistenceFunc
    checkModulesAvailability: CheckModulesAvailabilityFunc
  }
  media: {
    retrieveMedia: RetrieveMediaFunc
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
