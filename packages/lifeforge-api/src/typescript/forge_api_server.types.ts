import type {
  ZodIntersection,
  ZodObject,
  ZodRawShape,
  ZodTypeAny,
  z
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
  params?: ZodObjectOrIntersection
}

export type InferZodType<T> =
  T extends ZodObject<ZodRawShape> ? z.infer<T> : object
