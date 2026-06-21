/* eslint-disable @typescript-eslint/no-explicit-any */
import type z from 'zod'

import type { ForgeEndpoint } from '../core/forgeEndpoint'
import type { CoreHelperReturnTypes } from '../core/helpers/config'
import type {
  InferContractInput,
  InferContractMedia,
  InferContractOutput
} from './contract.types'

/**
 * Constructs a deeply-nested proxy tree from a server route schema.
 * Each endpoint becomes a `ForgeEndpoint`, nested groups become more `ProxyTree`.
 */

type ProxyTreeLeaf = {
  getMedia: (params: {
    collectionId: string
    recordId: string
    fieldId: string
    thumb?: string
    token?: string
  }) => string
  key: (string | Record<string, any> | null)[]
  schema: { query?: z.ZodTypeAny; body?: z.ZodTypeAny }
  endpoint: string
}

type ProxyTreeRootLeaf = ProxyTreeLeaf & {
  untyped: <TOutput = any, TBody = any, TQuery = any>(
    url: string
  ) => ForgeEndpoint<UntypedEndpointType<TOutput, TBody, TQuery>>
}

type ProxyTreeInternal<T> = {
  [K in keyof T]: T[K] extends { readonly method: string }
    ? ForgeEndpoint<{
        __isForgeContract: true
        __input: InferContractInput<T[K]>
        __output: InferContractOutput<T[K]>
        __media: InferContractMedia<T[K]>
      }>
    : ProxyTreeInternal<T[K]>
} & ProxyTreeLeaf

/** ProxyTree falls back to `AnyProxyTree` without strict typing when the contract is untyped (`any`). */

type IsAny<T> = 0 extends 1 & T ? true : false

type AnyProxyTree = {
  [K: string]: any
} & ProxyTreeRootLeaf &
  CoreHelperReturnTypes

type TypedProxyTree<T> = ProxyTreeInternal<T> &
  ProxyTreeRootLeaf &
  CoreHelperReturnTypes

export type ProxyTree<T> =
  IsAny<T> extends true ? AnyProxyTree : TypedProxyTree<T>

/**
 * Helper type for creating untyped endpoints.
 */
export type UntypedEndpointType<TOutput = any, TBody = any, TQuery = any> = {
  __isForgeContract: true
  __input: { body: TBody; query: TQuery }
  __output: TOutput
  __media: null
}
