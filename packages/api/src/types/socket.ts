 
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ForgeEndpoint } from '../proxy/forgeEndpoint'

type MediaFiles<M> = {
  [K in keyof M]: M[K] extends { multiple: true }
    ? M[K] extends { optional: true }
      ? File[] | undefined
      : File[]
    : M[K] extends { optional: true }
      ? File | string | undefined
      : File | string
}

/**
 * Infers the input TypeScript type from a Forge endpoint config object.
 */
export type InferRawInput<T> = T extends {
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
          ? B
          : (B extends undefined ? {} : B) & MediaFiles<M>
        query: Q
      }
    : never
  : never

/**
 * Infers the output (response) TypeScript type from a Forge endpoint config object.
 */
export type InferRawOutput<T> = T extends {
  __isForgeContract: true
  __output: infer O
}
  ? O
  : never

/**
 * Extracts the input schema type from a `ForgeEndpoint` instance.
 */
export type InferInput<T extends ForgeEndpoint> = T['__type'] extends {
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
          ? B
          : (B extends undefined ? {} : B) & MediaFiles<M>
        query: Q
      }
    : never
  : never

/**
 * Extracts the output (response) type from a `ForgeEndpoint` instance.
 */
export type InferOutput<T extends ForgeEndpoint> = T['__type'] extends {
  __isForgeContract: true
  __output: infer O
}
  ? O
  : never
