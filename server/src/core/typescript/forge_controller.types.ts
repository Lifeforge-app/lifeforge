import { BaseResponse } from '@typescript/base_response'
import { Request, Response } from 'express'
import PocketBase from 'pocketbase'
import { Server } from 'socket.io'
import { ZodIntersection, ZodObject, ZodRawShape, ZodTypeAny, z } from 'zod/v4'

type InferZodType<T> = T extends ZodObject<ZodRawShape> ? z.infer<T> : {}
type InferResponseType<T> = T extends ZodTypeAny ? z.infer<T> : {}

export type ZodObjectOrIntersection =
  | ZodObject<ZodRawShape>
  | ZodIntersection<any, any>

type ForgeSchema<
  B extends ZodObjectOrIntersection | undefined,
  Q extends ZodObjectOrIntersection | undefined,
  P extends ZodObjectOrIntersection | undefined,
  R extends ZodTypeAny
> = {
  body?: B
  query?: Q
  params?: P
  response: R
}

type ControllerContext<
  B extends ZodObjectOrIntersection | undefined,
  Q extends ZodObjectOrIntersection | undefined,
  P extends ZodObjectOrIntersection | undefined,
  R extends ZodTypeAny
> = {
  req: Request<InferZodType<P>, any, InferZodType<B>, InferZodType<Q>>
  res: Response<BaseResponse<InferResponseType<R>>>
  io: Server
  pb: PocketBase
  params: InferZodType<P>
  body: InferZodType<B>
  query: InferZodType<Q>
}

type ControllerCallback<
  B extends ZodObjectOrIntersection | undefined,
  Q extends ZodObjectOrIntersection | undefined,
  P extends ZodObjectOrIntersection | undefined,
  R extends ZodTypeAny
> = (context: ControllerContext<B, Q, P, R>) => Promise<InferResponseType<R>>

type ExistenceCheckConfig<T> = Partial<Record<keyof InferZodType<T>, string>>

type ForgeOptions<
  B extends ZodObjectOrIntersection | undefined,
  Q extends ZodObjectOrIntersection | undefined,
  P extends ZodObjectOrIntersection | undefined
> = {
  existenceCheck?: {
    params?: ExistenceCheckConfig<P>
    body?: ExistenceCheckConfig<B>
    query?: ExistenceCheckConfig<Q>
  }
  statusCode?: number
  noDefaultResponse?: boolean
  description?: string
}

export type {
  ForgeSchema as ControllerSchema,
  ControllerContext,
  ControllerCallback,
  ExistenceCheckConfig,
  ForgeOptions as ControllerOptions,
  InferZodType,
  InferResponseType
}
