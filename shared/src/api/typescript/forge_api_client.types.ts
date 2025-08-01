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

/**
 * Infers the *input* TypeScript type from a Forge controller config object,
 * using its embedded Zod schema definitions.
 * - Produces a plain object type with values inferred from Zod.
 *
 * @template T The controller config object, must have `__isForgeController` and `__input` fields.
 * @example
 * type MyInput = InferInput<typeof myController>
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
            ? z.infer<B>
            : Record<string, any>
          : (B extends ZodObjectOrIntersection
              ? z.infer<B>
              : Record<string, any>) & {
              [K in keyof M]: M[K] extends { optional: true }
                ? File | string | undefined
                : File | string
            }
        query: Q extends ZodObjectOrIntersection ? z.infer<Q> : never
      }
    : never
  : never

/**
 * Infers the *output* (response) TypeScript type from a Forge controller config object.
 *
 * @template T The controller config object, must have `__isForgeController` and `__output` fields.
 * @example
 * type MyOutput = InferOutput<typeof myController>
 */
export type InferOutput<T> = T extends {
  __isForgeController: true
  __output: infer O
}
  ? O
  : never

/**
 * Extracts the input schema (as plain TypeScript type) from a `ForgeAPIClientController` instance.
 *
 * @template T The ForgeAPIClientController instance
 * @example
 * type Input = InferClientControllerInput<typeof apiClient>
 */
export type InferClientControllerInput<
  T extends ForgeAPIClientController<any>
> = T['__type'] extends {
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
            ? z.infer<B>
            : Record<string, any>
          : (B extends ZodObjectOrIntersection
              ? z.infer<B>
              : Record<string, any>) & {
              [K in keyof M]: {
                __type: 'media'
                config: M[K]
              }
            }
        query: Q extends ZodObjectOrIntersection ? z.infer<Q> : never
      }
    : never
  : never

/**
 * Extracts the output schema (response type) from a `ForgeAPIClientController` instance.
 *
 * @template T The ForgeAPIClientController instance
 * @example
 * type Output = InferClientControllerOutput<typeof apiClient>
 */
export type InferClientControllerOutput<
  T extends ForgeAPIClientController<any>
> = T['__type'] extends {
  __isForgeController: true
  __output: infer O
}
  ? O
  : never

/**
 * Constructs a deeply-nested client tree from a controller schema.
 * - Each controller becomes a `ForgeAPIClientController`
 * - Nested groups become more `ClientTree`
 *
 * This is what powers your chainable, type-safe API client.
 *
 * @template T The API schema tree (usually from your backend type export)
 * @example
 * const api = createForgeAPIClient<typeof schema>(...)
 * // api.foo.bar.mutate() etc.
 */
export type ClientTree<T> = {
  [K in keyof T]: T[K] extends { __isForgeController: true }
    ? ForgeAPIClientController<T[K]>
    : ClientTree<T[K]>
}
