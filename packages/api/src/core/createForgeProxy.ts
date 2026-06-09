/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ProxyTree,
  UntypedEndpointType
} from '../typescript/forge_proxy.types'
import { ForgeEndpoint } from './forgeEndpoint'
import { CORE_HELPERS } from './helpers/config'
import { createCoreHelper } from './helpers/createCoreHelper'
import { createGetMediaHelper } from './helpers/getMediaHelper'
import { globalProxyRegistry } from './registry'

/**
 * Creates a type-safe, proxy-based API client that mirrors your route contract structure.
 *
 * Traverses the generated routes contract statically at type-level using json-schema-to-ts,
 * and dynamically at runtime using Proxy traps.
 */
export function createForgeProxy<T>(contract: T): ProxyTree<T> {
  return createForgeProxyInternal(contract, [])
}

function createForgeProxyInternal<T>(
  contract: T,
  path: string[] | string
): ProxyTree<T> {
  const pathArray = Array.isArray(path) ? path : [path]

  // Resolve sub-contract for current path traversal
  let currentContract: any = contract

  for (const part of pathArray) {
    if (currentContract && typeof currentContract === 'object') {
      currentContract = currentContract[part]
    }
  }

  function getResolvedHost() {
    return (
      (contract && globalProxyRegistry.get(contract)?.apiHost) ||
      globalProxyRegistry.apiHost ||
      ''
    )
  }

  const endpoint = new ForgeEndpoint<any>(
    getResolvedHost(),
    pathArray.join('/'),
    currentContract,
    contract
  )

  return new Proxy(() => {}, {
    get: (_, prop: string | symbol) => {
      if (typeof prop === 'symbol') {
        if (prop === Symbol.toStringTag) return 'ForgeProxy'
        if (prop === Symbol.toPrimitive) return () => '[ForgeProxy]'

        return undefined
      }

      if (prop === 'then') return undefined

      if (prop === 'name' || prop === 'length' || prop === 'prototype') {
        return undefined
      }

      if (prop === 'toJSON' || prop === 'valueOf' || prop === 'toString') {
        return () => `[ForgeProxy: ${pathArray.join('/')}]`
      }

      if (prop === 'untyped') {
        return <TOutput = any, TBody = any, TQuery = any>(url: string) =>
          new ForgeEndpoint<UntypedEndpointType<TOutput, TBody, TQuery>>(
            getResolvedHost(),
            url,
            undefined,
            contract
          )
      }

      if (prop === 'getMedia') {
        return createGetMediaHelper(getResolvedHost())
      }

      if (prop in CORE_HELPERS) {
        return createCoreHelper(
          getResolvedHost(),
          prop as keyof typeof CORE_HELPERS
        )
      }

      if (prop in endpoint && typeof (endpoint as any)[prop] !== 'undefined') {
        const value = (endpoint as any)[prop]

        return typeof value === 'function' ? value.bind(endpoint) : value
      }

      return createForgeProxyInternal(contract, [...pathArray, prop as string])
    },

    apply: () => {
      throw new Error(
        `Invalid function call on path: ${pathArray.join('.')}. - maybe you meant to use .input(), .queryOptions(), or .getMutationOptions()?`
      )
    }
  }) as any
}
