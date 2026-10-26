/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ProxyTree, UntypedEndpointType } from '../types/proxy'
import { ForgeEndpoint } from './forgeEndpoint'
import { CORE_HELPERS } from './helpers/config'
import { createCoreHelper } from './helpers/createCoreHelper'
import { createGetMediaHelper } from './helpers/getMediaHelper'
import { type ProxyScope, forgeConfig } from './scope'

/**
 * Creates a type-safe, proxy-based API client that mirrors your route contract structure.
 *
 * The generic is the generated `Contract` declaration for this owner (core or a
 * module). Routing metadata (`remoteId`) is bound by the host after a federated
 * module loads, so no generated value is needed at runtime.
 */
export function createForgeProxy<T>(scope: ProxyScope = {}): ProxyTree<T> {
  return createForgeProxyInternal<T>(scope, [])
}

function createForgeProxyInternal<T>(
  scope: ProxyScope,
  path: string[]
): ProxyTree<T> {
  const getResolvedHost = () => forgeConfig.apiHost

  const endpoint = new ForgeEndpoint<any>(scope, path.join('/'))

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
        return () => `[ForgeProxy: ${path.join('/')}]`
      }

      if (path.length === 0 && prop === 'untyped') {
        return <TOutput = any, TBody = any, TQuery = any>(url: string) =>
          new ForgeEndpoint<UntypedEndpointType<TOutput, TBody, TQuery>>(
            scope,
            url
          )
      }

      if (prop === 'getMedia') {
        return createGetMediaHelper(getResolvedHost())
      }

      if (path.length === 0 && prop in CORE_HELPERS) {
        return createCoreHelper(prop as keyof typeof CORE_HELPERS)
      }

      if (prop in endpoint && typeof (endpoint as any)[prop] !== 'undefined') {
        const value = (endpoint as any)[prop]

        return typeof value === 'function' ? value.bind(endpoint) : value
      }

      return createForgeProxyInternal<T>(scope, [...path, prop])
    },

    apply: () => {
      throw new Error(
        `Invalid function call on path: ${path.join('.')}. - maybe you meant to use .input(), .queryOptions(), or .getMutationOptions()?`
      )
    }
  }) as any
}
