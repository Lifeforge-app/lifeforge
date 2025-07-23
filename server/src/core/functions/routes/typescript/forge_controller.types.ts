import { PBService } from '@functions/database'
import { BaseResponse } from '@typescript/base_response'
import { Request, Response } from 'express'
import { Server } from 'socket.io'
import { ZodIntersection, ZodObject, ZodRawShape, ZodTypeAny, z } from 'zod/v4'

type InferZodType<T> = T extends ZodObject<ZodRawShape> ? z.infer<T> : object

export type ZodObjectOrIntersection =
  | ZodObject<ZodRawShape>
  | ZodIntersection<ZodTypeAny, ZodTypeAny>

export type InputSchema = {
  body?: ZodObjectOrIntersection
  query?: ZodObjectOrIntersection
  params?: ZodObjectOrIntersection
}

type Context<TInput extends InputSchema, TOutput = unknown> = {
  req: Request<
    InferZodType<TInput['params']>,
    BaseResponse<TOutput>,
    InferZodType<TInput['body']>,
    InferZodType<TInput['query']>
  >
  res: Response<BaseResponse<TOutput>>
  io: Server
  pb: PBService
  params: InferZodType<TInput['params']>
  body: InferZodType<TInput['body']>
  query: InferZodType<TInput['query']>
}

type Callback<TInput extends InputSchema, TOutput = unknown> = (
  context: Context<TInput, TOutput>
) => Promise<TOutput>

type ExistenceCheckConfig<T> = Partial<Record<keyof InferZodType<T>, string>>

type Options<TInput extends InputSchema> = {
  existenceCheck?: {
    params?: ExistenceCheckConfig<TInput['params']>
    body?: ExistenceCheckConfig<TInput['body']>
    query?: ExistenceCheckConfig<TInput['query']>
  }
  statusCode?: number
  noDefaultResponse?: boolean
  description?: string
}

export type { Context, Callback, ExistenceCheckConfig, Options, InferZodType }
