/* eslint-disable @typescript-eslint/no-explicit-any */
import type z from 'zod'
import type { ZodIntersection, ZodObject, ZodRawShape, ZodTypeAny } from 'zod'
import type { FromSchema } from 'json-schema-to-ts'

import type ForgeEndpoint from '../core/forgeEndpoint'
import type { CoreHelperReturnTypes } from '../core/helpers/config'

type ZodObjectOrIntersection =
  | ZodObject<ZodRawShape>
  | ZodIntersection<ZodTypeAny, ZodTypeAny>

export type InferFromJSONSchema<T> = T extends undefined
  ? undefined
  : T extends boolean
    ? undefined
    : T extends object
      ? FromSchema<T>
      : undefined

export type InferContractInput<T> = T extends {
  readonly input?: {
    readonly query?: infer Q
    readonly body?: infer B
  }
}
  ? {
      body: B extends ZodTypeAny
        ? B
        : B extends object
          ? InferFromJSONSchema<B>
          : undefined
      query: Q extends ZodTypeAny
        ? Q
        : Q extends object
          ? InferFromJSONSchema<Q>
          : undefined
    }
  : {
      body: undefined
      query: undefined
    }

export type InferContractOutput<T> = T extends {
  readonly output: infer O
}
  ? O extends { readonly OK: infer OKSchema }
    ? InferFromJSONSchema<OKSchema>
    : O extends { readonly CREATED: infer CreatedSchema }
      ? InferFromJSONSchema<CreatedSchema>
      : any
  : never

export type InferContractMedia<T> = T extends {
  readonly media?: infer M
}
  ? M extends undefined
    ? null
    : M
  : null


/**
 * Infers the input TypeScript type from a Forge endpoint config object.
 * Uses embedded Zod schema definitions to produce a plain object type.
 */
export type InferInput<T> = T extends {
  __isForgeContract: true
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
            : B
          : (B extends ZodObjectOrIntersection
              ? z.input<B>
              : B extends undefined
                ? {}
                : B) & {
              [K in keyof M]: M[K] extends { multiple: true }
                ? M[K] extends { optional: true }
                  ? File[] | undefined
                  : File[]
                : M[K] extends { optional: true }
                  ? File | string | undefined
                  : File | string
            }
        query: Q extends ZodObjectOrIntersection ? z.input<Q> : Q
      }
    : never
  : never

/**
 * Infers the output (response) TypeScript type from a Forge endpoint config object.
 */
export type InferOutput<T> = T extends {
  __isForgeContract: true
  __output: infer O
}
  ? O
  : never

/**
 * Extracts the input schema type from a `ForgeEndpoint` instance.
 */
export type InferClientControllerInput<T extends ForgeEndpoint<any>> =
  T['__type'] extends {
    __isForgeContract: true
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
              : B
            : (B extends ZodObjectOrIntersection
                ? z.input<B>
                : B extends undefined
                  ? {}
                  : B) & {
                [K in keyof M]: {
                  __type: 'media'
                  config: M[K]
                }
              }
          query: Q extends ZodObjectOrIntersection ? z.input<Q> : Q
        }
      : never
    : never

/**
 * Extracts the output (response) type from a `ForgeEndpoint` instance.
 */
export type InferClientControllerOutput<T extends ForgeEndpoint<any>> =
  T['__type'] extends {
    __isForgeContract: true
    __output: infer O
  }
    ? O
    : never

/**
 * Constructs a deeply-nested proxy tree from a server route schema.
 * Each endpoint becomes a `ForgeEndpoint`, nested groups become more `ProxyTree`.
 */
export type ProxyTree<T> = {
  [K in keyof T]: T[K] extends { readonly method: string }
    ? ForgeEndpoint<{
        __isForgeContract: true
        __input: InferContractInput<T[K]>
        __output: InferContractOutput<T[K]>
        __media: InferContractMedia<T[K]>
      }>
    : ProxyTree<T[K]>
} & {
  untyped: <TOutput = any, TBody = any, TQuery = any>(
    url: string
  ) => ForgeEndpoint<UntypedEndpointType<TOutput, TBody, TQuery>>
  getMedia: (params: {
    collectionId: string
    recordId: string
    fieldId: string
    thumb?: string
    token?: string
  }) => string
} & CoreHelperReturnTypes

/**
 * Helper type for creating untyped endpoints.
 */
export type UntypedEndpointType<TOutput = any, TBody = any, TQuery = any> = {
  __isForgeContract: true
  __input: { body: TBody; query: TQuery }
  __output: TOutput
  __media: null
}
