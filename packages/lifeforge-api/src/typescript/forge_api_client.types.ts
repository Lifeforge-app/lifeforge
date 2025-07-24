/* eslint-disable @typescript-eslint/no-explicit-any */
import type z from 'zod/v4'
import type {
  ZodIntersection,
  ZodObject,
  ZodRawShape,
  ZodTypeAny
} from 'zod/v4'

import type { ForgeControllerBuilderBase } from '../core/forgeControllerBase'
import type { ForgeAPIClientController } from '../core/forgeAPIClient'

type ZodObjectOrIntersection =
  | ZodObject<ZodRawShape>
  | ZodIntersection<ZodTypeAny, ZodTypeAny>

export type InferInput<T> =
  T extends ForgeControllerBuilderBase<string, infer I, any>
    ? I extends Record<string, ZodObjectOrIntersection>
      ? {
          [K in keyof I]: I[K] extends ZodObjectOrIntersection
            ? z.infer<I[K]>
            : never
        }
      : never
    : never

export type InferOutput<T> = T extends ForgeControllerBuilderBase
  ? T['_output']
  : never

export type InferClientControllerInput<
  T extends ForgeAPIClientController<any>
> =
  T['__type'] extends ForgeControllerBuilderBase<string, infer I, any>
    ? I extends Record<string, ZodObjectOrIntersection>
      ? {
          [K in keyof I]: I[K] extends ZodObjectOrIntersection
            ? z.infer<I[K]>
            : never
        }
      : never
    : never

export type InferClientControllerOutput<
  T extends ForgeAPIClientController<any>
> =
  T['__type'] extends ForgeControllerBuilderBase<string, any, infer O>
    ? O
    : never

export type FilteredRouteKey<T> = {
  [K in keyof T]: T[K] extends ForgeControllerBuilderBase ? never : K
}[keyof T]

type RouteNameMap<T> = {
  [K in keyof T]: T[K] extends ForgeControllerBuilderBase<infer R, any, any>
    ? [R, K]
    : never
}[keyof T]

type RouteToKeyMap<T> = {
  [P in RouteNameMap<T> as P[0]]: P[1]
}

export type RouteKeys<T> = keyof RouteToKeyMap<T>

export type ControllerByRoute<
  T,
  R extends RouteKeys<T>,
  K extends keyof T = RouteToKeyMap<T>[R] & keyof T
> =
  T[K] extends ForgeControllerBuilderBase<infer R, any, any>
    ? R extends string
      ? T[K]
      : never
    : never
