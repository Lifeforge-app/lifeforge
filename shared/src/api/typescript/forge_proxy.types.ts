/* eslint-disable @typescript-eslint/no-explicit-any */
import type z from 'zod'
import type { ZodIntersection, ZodObject, ZodRawShape, ZodTypeAny } from 'zod'

import type ForgeEndpoint from '../core/forgeEndpoint'

type ZodObjectOrIntersection =
  | ZodObject<ZodRawShape>
  | ZodIntersection<ZodTypeAny, ZodTypeAny>

/**
 * Infers the input TypeScript type from a Forge endpoint config object.
 * Uses embedded Zod schema definitions to produce a plain object type.
 *
 * @template T - The endpoint config object with `__isForgeController` and `__input` fields
 *
 * @example
 * ```typescript
 * type UserInput = InferInput<typeof userEndpoint>
 * // { body: { name: string }, query: { id: string } }
 * ```
 */
export type InferInput<T> = T extends {
  __isForgeController: true
  __input: infer I
  __media: infer M
}
  ? I extends {
      body?: infer B
      query?: infer Q
    }
    ? {
        body: M extends null
          ? B extends ZodObjectOrIntersection
            ? z.input<B>
            : Record<string, any>
          : (B extends ZodObjectOrIntersection
              ? z.input<B>
              : Record<string, any>) & {
              [K in keyof M]: M[K] extends { multiple: true }
                ? M[K] extends { optional: true }
                  ? File[] | undefined
                  : File[]
                : M[K] extends { optional: true }
                  ? File | string | undefined
                  : File | string
            }
        query: Q extends ZodObjectOrIntersection ? z.input<Q> : never
      }
    : never
  : never

/**
 * Infers the output (response) TypeScript type from a Forge endpoint config object.
 *
 * @template T - The endpoint config object with `__isForgeController` and `__output` fields
 *
 * @example
 * ```typescript
 * type UserResponse = InferOutput<typeof userEndpoint>
 * // { id: string, name: string, email: string }
 * ```
 */
export type InferOutput<T> = T extends {
  __isForgeController: true
  __output: infer O
}
  ? O
  : never

/**
 * Extracts the input schema type from a `ForgeEndpoint` instance.
 *
 * @template T - The ForgeEndpoint instance type
 *
 * @example
 * ```typescript
 * type Input = InferClientControllerInput<typeof forgeAPI.users.create>
 * ```
 */
export type InferClientControllerInput<T extends ForgeEndpoint<any>> =
  T['__type'] extends {
    __isForgeController: true
    __input: infer I
    __media: infer M
  }
    ? I extends {
        body?: infer B
        query?: infer Q
      }
      ? {
          body: M extends null
            ? B extends ZodObjectOrIntersection
              ? z.input<B>
              : Record<string, any>
            : (B extends ZodObjectOrIntersection
                ? z.input<B>
                : Record<string, any>) & {
                [K in keyof M]: {
                  __type: 'media'
                  config: M[K]
                }
              }
          query: Q extends ZodObjectOrIntersection ? z.input<Q> : never
        }
      : never
    : never

/**
 * Extracts the output (response) type from a `ForgeEndpoint` instance.
 *
 * @template T - The ForgeEndpoint instance type
 *
 * @example
 * ```typescript
 * type Output = InferClientControllerOutput<typeof forgeAPI.users.get>
 * ```
 */
export type InferClientControllerOutput<T extends ForgeEndpoint<any>> =
  T['__type'] extends {
    __isForgeController: true
    __output: infer O
  }
    ? O
    : never

/**
 * Constructs a deeply-nested proxy tree from a server route schema.
 * Each endpoint becomes a `ForgeEndpoint`, nested groups become more `ProxyTree`.
 *
 * This powers the chainable, type-safe API client.
 *
 * @template T - The API schema tree (from server route exports)
 *
 * @example
 * ```typescript
 * const forgeAPI = createForgeProxy<typeof serverRoutes>('https://api.example.com')
 * // forgeAPI.users.list -> ForgeEndpoint
 * // forgeAPI.posts.comments.create -> ForgeEndpoint
 * ```
 */
export type ProxyTree<T> = {
  [K in keyof T]: T[K] extends { __isForgeController: true }
    ? ForgeEndpoint<T[K]>
    : ProxyTree<T[K]>
}

/**
 * Helper type for creating untyped endpoints.
 * Used by `forgeAPI.untyped()` when you need to call an endpoint without full type inference.
 *
 * @template TOutput - Expected response type
 * @template TBody - Request body type
 * @template TQuery - Query parameters type
 *
 * @example
 * ```typescript
 * const endpoint = forgeAPI.untyped<{ id: string }>('custom/endpoint')
 * const result = await endpoint.query()
 * ```
 */
export type UntypedEndpointType<TOutput = any, TBody = any, TQuery = any> = {
  __isForgeController: true
  __input: { body: TBody; query: TQuery }
  __output: TOutput
  __media: null
}
