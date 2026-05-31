import type { Request, RequestHandler, Response } from 'express'
import type { Server } from 'socket.io'
import type { z } from 'zod'

import { CleanedSchemas } from '@lifeforge/server-utils'

import IPBService from '../pocketbase/PBService.interface'
import {
  OutputDefinition,
  OutputHelpers
} from '../response/response_helpers.types'
import { ConvertMedia, MediaConfig } from '../standalone/media.types'
import { CoreContext } from './core_context.types'

export interface ForgeExpressContext<
  TSchemas extends CleanedSchemas = CleanedSchemas
> {
  req: Request
  res: Response
  io: Server
  pb: IPBService<TSchemas>
  body: unknown
  query: unknown
  media: unknown
  core: CoreContext
}

export interface ForgeContract {
  readonly __isForgeContract: true
  getValue(): {
    method: 'get' | 'post'
    middlewares: RequestHandler[]
    schema: {
      query: z.ZodTypeAny | undefined
      body: z.ZodTypeAny | undefined
    }
    output: OutputDefinition
    noDefaultResponse: boolean
    existenceCheck: {
      body?: Record<string, string>
      query?: Record<string, string>
    }
    description: string
    isDownloadable: boolean
    media: MediaConfig | null
    noAuth: boolean
    encrypted: boolean
    callback: (
      context: ForgeExpressContext
    ) => Promise<{ $status: number; payload?: unknown }>
    callerModule?: { source: string; id: string }
  }
}

export type ForgeContext<
  TSchemas extends CleanedSchemas,
  TQuery extends z.ZodTypeAny | undefined,
  TBody extends z.ZodTypeAny | undefined,
  TOutput extends OutputDefinition,
  TMedia extends MediaConfig | null
> = {
  response: OutputHelpers<TOutput>
  body: TBody extends z.ZodTypeAny ? z.infer<TBody> : undefined
  query: TQuery extends z.ZodTypeAny ? z.infer<TQuery> : undefined
  media: ConvertMedia<TMedia>
  req: Request
  res: Response
  io: Server
  pb: IPBService<TSchemas>
  core: CoreContext
}
