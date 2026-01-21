/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ProxyTree,
  UntypedEndpointType
} from '../typescript/forge_proxy.types'
import ForgeEndpoint from './forgeEndpoint'
import CORE_HELPERS from './helpers/config'
import createCoreHelper from './helpers/createCoreHelper'
import createGetMediaHelper from './helpers/getMediaHelper'

/**
 * Creates a type-safe, proxy-based API client that mirrors your server's route structure.
 *
 * The returned proxy allows ergonomic, chainable API access:
 * ```typescript
 * forgeAPI.users.list.input({ page: 1 }).query()
 * forgeAPI.posts.create.mutate({ title: 'Hello' })
 * ```
 *
 * Features:
 * - **Type Safety**: Full TypeScript inference from server schemas
 * - **Chainable API**: Build requests fluently with `.input()`, `.query()`, `.mutate()`
 * - **React Query Integration**: Use `.queryOptions()` and `.mutationOptions()` directly
 * - **End-to-End Encryption**: All requests are encrypted by default
 * - **Core Helpers**: Built-in methods like `getMedia()`, `checkAPIKeys()`, etc.
 *
 * @template T - API tree schema type (usually inferred from backend route exports)
 * @param apiHost - The base URL of the API server (e.g., 'https://api.example.com' or '/api')
 * @param path - Internal: path segments accumulated during proxy traversal
 * @returns A proxied API client tree with full type inference
 *
 * @example
 * ```typescript
 * // Create the client
 * const forgeAPI = createForgeProxy<typeof serverRoutes>('https://api.example.com')
 *
 * // Use with React Query
 * const { data } = useQuery(forgeAPI.users.list.queryOptions())
 *
 * // Direct execution
 * const user = await forgeAPI.users.get.input({ id: '123' }).query()
 *
 * // Use core helpers
 * const mediaUrl = forgeAPI.getMedia({ collectionId, recordId, fieldId })
 * ```
 */
export default function createForgeProxy<T>(
  apiHost?: string,
  path: string[] | string = []
): ProxyTree<T> {
  path = Array.isArray(path) ? path : [path]

  const endpoint = new ForgeEndpoint<
    T extends { __isForgeController: true } ? T : never
  >(apiHost, path.join('/'))

  return new Proxy(() => {}, {
    get: (_, prop: string | symbol) => {
      // Handle symbol properties (like Symbol.toStringTag, Symbol.toPrimitive)
      if (typeof prop === 'symbol') {
        if (prop === Symbol.toStringTag) return 'ForgeProxy'
        if (prop === Symbol.toPrimitive) return () => '[ForgeProxy]'

        return undefined
      }

      // Skip Promise thenable check
      if (prop === 'then') return undefined

      // Handle function introspection properties that tools might access
      if (prop === 'name' || prop === 'length' || prop === 'prototype') {
        return undefined
      }

      // Handle serialization methods for DevTools/debugging
      if (prop === 'toJSON' || prop === 'valueOf' || prop === 'toString') {
        return () => `[ForgeProxy: ${path.join('/')}]`
      }

      // Handle untyped() method
      if (prop === 'untyped') {
        return <TOutput = any, TBody = any, TQuery = any>(url: string) =>
          new ForgeEndpoint<UntypedEndpointType<TOutput, TBody, TQuery>>(
            apiHost,
            url
          )
      }

      // Handle getMedia() method - returns URL string
      if (prop === 'getMedia') {
        return createGetMediaHelper(apiHost)
      }

      // Handle core helper methods (checkAPIKeys, corsAnywhere, getGoogleFont)
      if (prop in CORE_HELPERS) {
        return createCoreHelper(apiHost, prop as keyof typeof CORE_HELPERS)
      }

      if (prop in endpoint && typeof (endpoint as any)[prop] !== 'undefined') {
        const value = (endpoint as any)[prop]

        return typeof value === 'function' ? value.bind(endpoint) : value
      }

      return createForgeProxy(apiHost, [...path, prop])
    },

    apply: () => {
      throw new Error(
        `Invalid function call on path: ${path.join('.')}. — maybe you meant to use .input(), .queryOptions(), or .getMutationOptions()?`
      )
    }
  }) as any
}
