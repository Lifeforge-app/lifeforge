/* eslint-disable @typescript-eslint/no-explicit-any */
import type z from 'zod/v4'
import type {
  ZodIntersection,
  ZodObject,
  ZodRawShape,
  ZodTypeAny
} from 'zod/v4'

import type { ForgeAPIClientController } from '../core/forgeAPIClient'

type ZodObjectOrIntersection =
  | ZodObject<ZodRawShape>
  | ZodIntersection<ZodTypeAny, ZodTypeAny>

export type InferInput<T> = T extends {
  __isForgeController: true
  __input: infer I
}
  ? I extends Record<string, ZodObjectOrIntersection>
    ? {
        [K in keyof I]: I[K] extends ZodObjectOrIntersection
          ? z.infer<I[K]>
          : never
      }
    : never
  : never

export type InferOutput<T> = T extends {
  __isForgeController: true
  __output: infer O
}
  ? O
  : never

export type InferClientControllerInput<
  T extends ForgeAPIClientController<any>
> = T['__type'] extends { __isForgeController: true; __input: infer I }
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
> = T['__type'] extends {
  __isForgeController: true
  __output: infer O
}
  ? O
  : never

export type FilteredRouteKey<T> = {
  [K in keyof T]: T[K] extends { __isForgeController: true } ? never : K
}[keyof T]

type RouteNameMap<T> = {
  [K in keyof T]: T[K] extends { __route: infer R }
    ? [R extends string | number | symbol ? R : never, K]
    : never
}[keyof T]

type RouteToKeyMap<T> = {
  [P in RouteNameMap<T> as P[0] extends string | number | symbol
    ? P[0]
    : never]: P[1]
}

export type RouteKeys<T> = keyof RouteToKeyMap<T>

export type ClientTree<T> = {
  [K in keyof T]: T[K] extends { __isForgeController: true }
    ? ForgeAPIClientController<T[K]>
    : ClientTree<T[K]>
}
