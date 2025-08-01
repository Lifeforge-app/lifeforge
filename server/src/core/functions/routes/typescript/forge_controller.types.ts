import type { PBService } from '@functions/database'
import type { Request, Response } from 'express'
import type { Server } from 'socket.io'
import { z } from 'zod/v4'
import type { ZodIntersection, ZodObject, ZodTypeAny } from 'zod/v4'

export interface BaseResponse<T = ''> {
  data?: T
  state: 'success' | 'error' | 'accepted'
  message?: string
}

export type ZodObjectOrIntersection =
  | ZodObject<any>
  | ZodIntersection<ZodTypeAny, ZodTypeAny>

export type InputSchema = {
  body?: ZodObjectOrIntersection
  query?: ZodObjectOrIntersection
}

export type InferZodType<T> = T extends ZodObject<any> ? z.infer<T> : object

export type ReplaceFileWithMulter<T> = T extends File
  ? Express.Multer.File
  : T extends (infer U)[]
    ? ReplaceFileWithMulter<U>[]
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<ReplaceFileWithMulter<U>>
      : T extends object
        ? T extends (...args: any[]) => any
          ? T
          : { [K in keyof T]: ReplaceFileWithMulter<T[K]> }
        : T

export type ConvertMedia<TMedia extends MediaConfig | null> =
  TMedia extends null
    ? Record<string, never>
    : {
        [K in keyof TMedia]: TMedia[K] extends { optional: true }
          ? Express.Multer.File | string | undefined
          : Express.Multer.File | string
      }

export type Context<
  TInput extends InputSchema,
  TOutput = unknown,
  TMedia extends MediaConfig | null = null
> = {
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
  media: ConvertMedia<TMedia>
}

export type MediaConfig = Record<
  string,
  {
    optional: boolean
  }
>
