/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'

import {
  createEncryptionSession,
  decryptResponse,
  encryptRequest,
  isEncryptedResponse
} from '../../utils/encryption'
import fetchAPI from '../../utils/fetchAPI'
import type {
  ClientTree,
  InferInput,
  InferOutput
} from '../typescript/forge_api_client.types'
import { getFormData, hasFile, joinObjectsRecursively } from './utils'

/**
 * Helper type to wrap a simple output type into the Forge controller structure.
 * Used by `untyped()` to allow passing just the response type.
 */
type UntypedControllerType<TOutput = any, TBody = any, TQuery = any> = {
  __isForgeController: true
  __input: { body: TBody; query: TQuery }
  __output: TOutput
  __media: null
}

/**
 * ForgeAPIClientController is a chainable API client controller for making type-safe
 * HTTP requests, designed to pair with LifeForge Server API schema and support React Query.
 *
 * Usage is chainable and ergonomic:
 *   - Set query parameters using `.input()`
 *   - Get fetch options for React Query via `.queryOptions()` and `.mutationOptions()`
 *   - Trigger requests directly with `.query()` and `.mutate()`
 *
 * Path is configured in the constructor, and query params are managed internally.
 *
 * @template T The controller type, inferred from API schema, must include `__isForgeController: true`.
 */
export class ForgeAPIClientController<
  T extends { __isForgeController: true } = any
> {
  /** Internal type, for type inference only */
  public __type!: T

  /** Internal storage for query parameters */
  protected _input: Record<string, any> | undefined

  /**
   * Creates a new API client controller for a specific route.
   * @param _apiHost The base URL of the API server
   * @param _route The endpoint path (without base URL)
   */
  constructor(
    private _apiHost: string = '',
    private _route: string
  ) {}

  /**
   * Returns the current cache key, which includes the route and query params.
   * Useful for React Query's `queryKey`.
   */
  get key() {
    return [
      ...this._route.split('/').filter(Boolean),
      this._input ?? null
    ].filter(Boolean)
  }

  /**
   * Returns the full endpoint URL (absolute), including query string if present.
   */
  get endpoint() {
    const path = this._getPath()

    // Handle relative URLs (e.g., /api)
    if (this._apiHost.startsWith('/')) {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''

      const normalizedPath = path.startsWith('/') ? path : `/${path}`

      return `${origin}${this._apiHost}${normalizedPath}`
    }

    return new URL(path, this._apiHost).toString()
  }

  setHost(apiHost: string) {
    this._apiHost = apiHost

    return this
  }

  /**
   * Set query parameters for the endpoint.
   * @param data Object of query parameters matching the input type
   * @returns A new controller instance for chaining
   */
  input(data: InferInput<T>['query']) {
    this._input = joinObjectsRecursively(
      this._input || {},
      data as Record<string, any>
    )

    return this
  }

  /**
   * Generates a React Query `UseQueryOptions` object for the current endpoint.
   * Uses end-to-end encryption by default for all queries.
   * @param options Optional overrides (excluding `queryKey` and `queryFn`)
   * @returns Options for use in React Query's `useQuery`
   */
  queryOptions(
    options: Omit<UseQueryOptions<any>, 'queryFn' | 'queryKey'> & {
      queryKey?: unknown[]
    } = {}
  ): UseQueryOptions<InferOutput<T>> {
    return {
      ...options,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      queryKey: options.queryKey ? options.queryKey : this.key,
      queryFn: () => this.query()
    }
  }

  /**
   * Generates a React Query `UseQueryOptions` object for raw (unencrypted) queries.
   * Use this for endpoints that have `.noEncryption()` enabled on the server.
   * @param options Optional overrides (excluding `queryKey` and `queryFn`)
   * @returns Options for use in React Query's `useQuery`
   */
  rawQueryOptions(
    options: Omit<UseQueryOptions<any>, 'queryFn' | 'queryKey'> & {
      queryKey?: unknown[]
    } = {}
  ): UseQueryOptions<InferOutput<T>> {
    return {
      ...options,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      queryKey: options.queryKey
        ? [...options.queryKey, 'raw']
        : [...this.key, 'raw'],
      queryFn: () => this.queryRaw()
    }
  }

  /**
   * Generates a React Query `UseMutationOptions` object for the current endpoint.
   * Uses end-to-end encryption by default for all mutations.
   * @param options Optional overrides (excluding `mutationKey` and `mutationFn`)
   * @returns Options for use in React Query's `useMutation`
   */
  mutationOptions(
    options: Omit<
      UseMutationOptions<InferOutput<T>, any, InferInput<T>['body']>,
      'mutationKey' | 'mutationFn'
    > = {}
  ): UseMutationOptions<InferOutput<T>, any, InferInput<T>['body']> {
    return {
      ...options,
      mutationKey: this.key,
      mutationFn: (data: InferInput<T>['body']) => {
        return this.mutate(data)
      }
    }
  }

  /**
   * Generates a React Query `UseMutationOptions` object for raw (unencrypted) mutations.
   * Use this for endpoints that have `.noEncryption()` enabled on the server.
   * @param options Optional overrides (excluding `mutationKey` and `mutationFn`)
   * @returns Options for use in React Query's `useMutation`
   */
  rawMutationOptions(
    options: Omit<
      UseMutationOptions<InferOutput<T>, any, InferInput<T>['body']>,
      'mutationKey' | 'mutationFn'
    > = {}
  ): UseMutationOptions<InferOutput<T>, any, InferInput<T>['body']> {
    return {
      ...options,
      mutationKey: [...this.key, 'raw'],
      mutationFn: (data: Partial<T>) => {
        return fetchAPI(this._apiHost, this._getPath(), {
          method: 'POST',
          body: hasFile(data) ? getFormData(data) : data
        })
      }
    }
  }

  /**
   * Triggers an end-to-end encrypted GET request to the current endpoint.
   * This is the default query method - all endpoints use encryption by default.
   *
   * @returns Promise resolving to the decrypted API response
   */
  async query(): Promise<InferOutput<T>> {
    // Create encryption session (generates AES key and encrypts it with server's public key)
    const { encryptedKey, session } = await createEncryptionSession()

    // Send GET request with encrypted AES key in header
    const response = await fetchAPI<{ iv: string; data: string; tag: string }>(
      this._apiHost,
      this._getPath(),
      {
        method: 'GET',
        headers: {
          'X-LifeForge-Key': encryptedKey
        }
      }
    )

    // Check if response is encrypted and decrypt it
    if (isEncryptedResponse(response)) {
      return await decryptResponse<InferOutput<T>>(response, session)
    }

    // If not encrypted (shouldn't happen with encrypted endpoints), return as-is
    return response as unknown as InferOutput<T>
  }

  /**
   * Triggers a raw (unencrypted) GET request to the current endpoint.
   * Use this for endpoints that have `.noEncryption()` enabled on the server.
   *
   * @returns Promise resolving to the API response
   */
  queryRaw(options?: {
    timeout?: number
    raiseError?: boolean
    isExternal?: boolean
  }) {
    return fetchAPI<InferOutput<T>>(this._apiHost, this._getPath(), {
      method: 'GET',
      ...options
    })
  }

  /**
   * Triggers a raw (unencrypted) POST request to the current endpoint.
   * Use this for endpoints that have `.noEncryption()` enabled on the server,
   * or for file uploads with FormData.
   *
   * @param data The body data for the request
   * @returns Promise resolving to the API response
   */
  mutateRaw(data: InferInput<T>['body'] | FormData) {
    return fetchAPI<InferOutput<T>>(this._apiHost, this._getPath(), {
      method: 'POST',
      body:
        data instanceof FormData
          ? data
          : hasFile(data)
            ? getFormData(data)
            : data
    })
  }

  /**
   * Triggers an end-to-end encrypted POST request to the current endpoint.
   * This is the default mutation method - all endpoints use encryption by default.
   *
   * This method:
   * 1. Generates a random AES key
   * 2. Encrypts the AES key with the server's RSA public key
   * 3. Encrypts the request body with AES-GCM
   * 4. Sends the encrypted payload to the server
   * 5. Decrypts the response using the same AES key
   *
   * Note: If the data contains files (File or Blob objects), this method
   * automatically falls back to raw (unencrypted) mode since FormData
   * cannot be encrypted.
   *
   * Prerequisites:
   * - Server public key must be set via `setServerPublicKey()`
   *
   * For endpoints with `.noEncryption()` on the server, use `mutateRaw()` instead.
   *
   * @param data The body data for the request (will be encrypted)
   * @returns Promise resolving to the decrypted API response
   *
   * @example
   * ```typescript
   * import { setServerPublicKey } from 'shared/utils/encryption'
   *
   * // Fetch and set the server's public key (once at app init)
   * const { publicKey } = await forgeAPI.encryptionPublicKey.query()
   * await setServerPublicKey(publicKey)
   *
   * // Make encrypted requests (default behavior)
   * const result = await forgeAPI.someEndpoint.mutate({
   *   sensitiveData: 'encrypted automatically'
   * })
   * ```
   */
  async mutate(data: InferInput<T>['body']): Promise<InferOutput<T>> {
    // If data contains files, fall back to raw mode (server also disables encryption for media endpoints)
    const isFormData =
      typeof FormData !== 'undefined' && (data as any) instanceof FormData

    if (isFormData || hasFile(data)) {
      return this.mutateRaw(data)
    }

    // Encrypt the request
    const { payload, session } = await encryptRequest(data)

    // Send encrypted payload
    const response = await fetchAPI<{ iv: string; data: string; tag: string }>(
      this._apiHost,
      this._getPath(),
      {
        method: 'POST',
        body: payload as unknown as Record<string, unknown>
      }
    )

    // Check if response is encrypted and decrypt it
    if (isEncryptedResponse(response)) {
      return await decryptResponse<InferOutput<T>>(response, session)
    }

    // If not encrypted (shouldn't happen with encrypted endpoints), return as-is
    return response as unknown as InferOutput<T>
  }

  /**
   * Constructs the endpoint path with query parameters if present.
   */
  protected _getPath() {
    let endpoint = `${this._route}`

    if (this._input) {
      const queryString = Object.entries(this._input)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => {
          // Manually encode to preserve + signs
          const encodedKey = encodeURIComponent(key)

          const encodedValue = encodeURIComponent(String(value))

          return `${encodedKey}=${encodedValue}`
        })
        .join('&')

      if (queryString) {
        endpoint += `?${queryString}`
      }
    }

    return endpoint
  }
}

/**
 * Recursively creates a chainable API client tree based on the provided type.
 * Allows ergonomic deep routing:
 *   `api.client.foo.bar.input(...).query()`
 *
 * Properties and methods from the controller are exposed at each leaf node.
 *
 * @template T API tree schema type (usually inferred from backend schema types)
 * @param apiHost The base URL of the API server
 * @param path The path segments accumulated so far (internal use)
 * @returns A proxied API client tree
 */
export function createForgeAPIClient<T>(
  apiHost?: string,
  path: string[] = []
): ClientTree<T> & {
  untyped: <TOutput = any, TBody = any, TQuery = any>(
    url: string
  ) => ForgeAPIClientController<UntypedControllerType<TOutput, TBody, TQuery>>
} {
  const controller = new ForgeAPIClientController<
    T extends { __isForgeController: true } ? T : never
  >(apiHost, path.join('/'))

  return new Proxy(() => {}, {
    get: (_, prop: string) => {
      if (typeof prop === 'symbol' || prop === 'then') return undefined

      // Handle untyped() method at root level
      if (prop === 'untyped' && path.length === 0) {
        return <TOutput = any, TBody = any, TQuery = any>(url: string) =>
          new ForgeAPIClientController<
            UntypedControllerType<TOutput, TBody, TQuery>
          >(apiHost, url)
      }

      if (
        prop in controller &&
        typeof (controller as any)[prop] !== 'undefined'
      ) {
        const value = (controller as any)[prop]

        return typeof value === 'function' ? value.bind(controller) : value
      }

      return createForgeAPIClient(apiHost, [...path, prop])
    },

    apply: () => {
      throw new Error(
        `Invalid function call on path: ${path.join(
          '.'
        )} — maybe you meant to use .input(), .queryOptions(), or .getMutationOptions()?`
      )
    }
  }) as any
}
