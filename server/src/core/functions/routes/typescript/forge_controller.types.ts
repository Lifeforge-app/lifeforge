import type { PBService } from '@functions/database'
import type { Request, Response } from 'express'
import type { Server } from 'socket.io'
import { z } from 'zod/v4'
import type {
  ZodIntersection,
  ZodObject,
  ZodRawShape,
  ZodTypeAny
} from 'zod/v4'

export interface BaseResponse<T = ''> {
  data?: T
  state: 'success' | 'error' | 'accepted'
  message?: string
}

export type ZodObjectOrIntersection =
  | ZodObject<ZodRawShape>
  | ZodIntersection<ZodTypeAny, ZodTypeAny>

export type InputSchema = {
  body?: ZodObjectOrIntersection
  query?: ZodObjectOrIntersection
}

export type InferZodType<T> =
  T extends ZodObject<ZodRawShape> ? z.infer<T> : object

export type Context<TInput extends InputSchema, TOutput = unknown> = {
  req: Request<
    never,
    BaseResponse<TOutput>,
    InferZodType<TInput['body']>,
    InferZodType<TInput['query']>
  >
  res: Response<BaseResponse<TOutput>>
  io: Server
  pb: PBService
  body: InferZodType<TInput['body']>
  query: InferZodType<TInput['query']>
}
