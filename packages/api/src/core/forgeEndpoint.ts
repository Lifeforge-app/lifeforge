/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { z } from 'zod'

import type { InferRawInput, InferRawOutput } from '../typescript'
import {
  createEncryptionSession,
  decryptResponse,
  encryptRequest,
  isEncryptedResponse
} from '../utils/encryption'
import { fetchAPI, type FetchAPIOptions, type ResponseWrapper } from '../utils/fetchAPI'
import { globalProxyRegistry } from './registry'
import { getFormData, hasFile, joinObjectsRecursively } from './utils'

type QueryRawOptions = Omit<FetchAPIOptions, 'method' | 'body'>
type MutateRawOptions = Omit<FetchAPIOptions, 'method' | 'body'>

/**
 * ForgeEndpoint is a chainable API endpoint handler for making type-safe
 * HTTP requests, designed to pair with LifeForge Server API schema and React Query.
 *
 * Usage is chainable and ergonomic:
 * - Set query parameters using `.input()`
 * - Get React Query options via `.queryOptions()` and `.mutationOptions()`
 * - Execute requests directly with `.query()` and `.mutate()`
 *
 * @template T The endpoint type, inferred from API schema, must include `__isForgeContract: true`.
 *
 * @example
 * ```typescript
 * // Using with React Query
 * const usersQuery = useQuery(forgeAPI.users.list.input({ page: 1 }).queryOptions())
 *
 * // Direct execution
 * const users = await forgeAPI.users.list.input({ page: 1 }).query()
 * ```
 */
export class ForgeEndpoint<T extends { __isForgeContract: true } = any> {
  /** Internal type marker for type inference */
  public __type!: T

  /** Query parameters storage */
  protected _input: Record<string, any> | undefined

  /**
   * Creates a new ForgeEndpoint for a specific route.
   * @param _apiHost - The base URL of the API server (e.g., 'https://api.example.com')
   * @param _route - The endpoint path (e.g., 'users/list')
   * @param _contract - Optional contract definition containing JSON schemas
   */
  constructor(
    private _apiHost: string = '',
    private _route: string,
    private _contract?: any,
    private _rootContract?: any
  ) {}

  private get _resolvedConfig() {
    const ctx = this._rootContract
      ? globalProxyRegistry.get(this._rootContract)
      : null

    if (ctx) {
      return {
        apiHost: ctx.apiHost,
        prefix: ctx.moduleId ? `modules/${ctx.moduleId}` : ''
      }
    }

    return {
      apiHost:
        this._apiHost ||
        (typeof window !== 'undefined' ? window.location.origin : ''),
      prefix: ''
    }
  }

  /**
   * Returns Zod schemas derived from the contract's JSON schemas.
   */
  public get schema() {
    return {
      query: this._contract?.input?.query
        ? z.fromJSONSchema(this._contract.input.query)
        : undefined,
      body: this._contract?.input?.body
        ? z.fromJSONSchema(this._contract.input.body)
        : undefined
    }
  }

  /**
   * Returns the current cache key, which includes the route and query params.
   * Useful for React Query's `queryKey`.
   */
  get key() {
    const { prefix } = this._resolvedConfig

    const prefixParts = prefix ? prefix.split('/').filter(Boolean) : []

    return [
      ...prefixParts,
      ...this._route.split('/').filter(Boolean),
      this._input ?? null
    ].filter(Boolean)
  }

  /**
   * Returns the full endpoint URL (absolute), including query string if present.
   */
  get endpoint() {
    const { apiHost, prefix } = this._resolvedConfig

    const path = this._getPath(prefix)

    // Handle relative URLs (e.g., /api)
    if (apiHost.startsWith('/')) {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''

      const normalizedPath = path.startsWith('/') ? path : `/${path}`

      return `${origin}${apiHost}${normalizedPath}`
    }

    return new URL(path, apiHost).toString()
  }

  /**
   * Updates the API host for this endpoint.
   * @param apiHost - The new base URL
   * @returns This endpoint instance for chaining
   */
  setHost(apiHost: string) {
    this._apiHost = apiHost

    return this
  }

  /**
   * Sets query parameters for the endpoint.
   * Parameters are merged with any existing parameters.
   *
   * @param data - Object of query parameters matching the input schema
   * @returns This endpoint instance for chaining
   *
   * @example
   * ```typescript
   * forgeAPI.users.list.input({ page: 1, limit: 10 }).query()
   * ```
   */
  input(data: InferRawInput<T>['query']) {
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
  ): UseQueryOptions<InferRawOutput<T>> {
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
  ): UseQueryOptions<InferRawOutput<T>> {
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
      UseMutationOptions<InferRawOutput<T>, any, InferRawInput<T>['body']>,
      'mutationKey' | 'mutationFn'
    > = {}
  ): UseMutationOptions<InferRawOutput<T>, any, InferRawInput<T>['body']> {
    return {
      ...options,
      mutationKey: this.key,
      mutationFn: (data: InferRawInput<T>['body']) => {
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
      UseMutationOptions<InferRawOutput<T>, any, InferRawInput<T>['body']>,
      'mutationKey' | 'mutationFn'
    > = {}
  ): UseMutationOptions<InferRawOutput<T>, any, InferRawInput<T>['body']> {
    return {
      ...options,
      mutationKey: [...this.key, 'raw'],
      mutationFn: (data: Partial<T>) => {
        const { apiHost, prefix } = this._resolvedConfig

        const path = this._getPath(prefix)

        return fetchAPI(apiHost, path, {
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
  async query(): Promise<InferRawOutput<T>> {
    const { apiHost, prefix } = this._resolvedConfig

    const path = this._getPath(prefix)

    // Create encryption session (generates AES key and encrypts it with server's public key)
    const { encryptedKey, session } = await createEncryptionSession()

    // Send GET request with encrypted AES key in header
    const response = await fetchAPI<{ iv: string; data: string; tag: string }>(
      apiHost,
      path,
      {
        method: 'GET',
        headers: {
          'X-LifeForge-Key': encryptedKey
        }
      }
    )

    // Check if response is encrypted and decrypt it
    if (isEncryptedResponse(response)) {
      return await decryptResponse<InferRawOutput<T>>(response, session)
    }

    // If not encrypted (shouldn't happen with encrypted endpoints), return as-is
    return response as unknown as InferRawOutput<T>
  }

  /**
   * Triggers a raw (unencrypted) GET request to the current endpoint.
   * Use this for endpoints that have `.noEncryption()` enabled on the server.
   *
   * @returns Promise resolving to the API response
   */
  queryRaw(
    options: { raw: true } & QueryRawOptions
  ): Promise<AxiosResponse<ResponseWrapper<InferRawOutput<T>>>>

  queryRaw(options?: { raw?: false } & QueryRawOptions): Promise<InferRawOutput<T>>

  queryRaw(options: { raw?: boolean } & QueryRawOptions = {}): Promise<
    AxiosResponse<ResponseWrapper<InferRawOutput<T>>> | InferRawOutput<T>
  > {
    const { apiHost, prefix } = this._resolvedConfig

    const path = this._getPath(prefix)
    const { raw, ...rest } = options

    if (raw) {
      return fetchAPI<InferRawOutput<T>>(apiHost, path, {
        raw: true as const,
        method: 'GET',
        ...rest
      })
    }

    return fetchAPI<InferRawOutput<T>>(apiHost, path, {
      method: 'GET',
      ...rest
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
  mutateRaw(
    data: InferRawInput<T>['body'] | FormData,
    options: { raw: true } & MutateRawOptions
  ): Promise<AxiosResponse<ResponseWrapper<InferRawOutput<T>>>>

  mutateRaw(
    data: InferRawInput<T>['body'] | FormData,
    options?: { raw?: false } & MutateRawOptions
  ): Promise<InferRawOutput<T>>

  mutateRaw(
    data: InferRawInput<T>['body'] | FormData,
    options: { raw?: boolean } & MutateRawOptions = {}
  ): Promise<AxiosResponse<ResponseWrapper<InferRawOutput<T>>> | InferRawOutput<T>> {
    const { apiHost, prefix } = this._resolvedConfig

    const path = this._getPath(prefix)
    const payloadData = data === undefined ? {} : data
    const { raw, ...rest } = options

    if (raw) {
      return fetchAPI<InferRawOutput<T>>(apiHost, path, {
        raw: true as const,
        method: 'POST',
        ...rest,
        body:
          payloadData instanceof FormData
            ? payloadData
            : hasFile(payloadData)
              ? getFormData(payloadData)
              : payloadData
      })
    }

    return fetchAPI<InferRawOutput<T>>(apiHost, path, {
      method: 'POST',
      ...rest,
      body:
        payloadData instanceof FormData
          ? payloadData
          : hasFile(payloadData)
            ? getFormData(payloadData)
            : payloadData
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
   * const publicKey = await forgeAPI.encryptionPublicKey.query()
   * await setServerPublicKey(publicKey)
   *
   * // Make encrypted requests (default behavior)
   * const result = await forgeAPI.someEndpoint.mutate({
   *   sensitiveData: 'encrypted automatically'
   * })
   * ```
   */
  async mutate(data: InferRawInput<T>['body']): Promise<InferRawOutput<T>> {
    const { apiHost, prefix } = this._resolvedConfig

    const path = this._getPath(prefix)

    const payloadData = data === undefined ? {} : data

    // If data contains files, fall back to raw mode (server also disables encryption for media endpoints)
    const isFormData =
      typeof FormData !== 'undefined' &&
      (payloadData as any) instanceof FormData

    if (isFormData || hasFile(payloadData)) {
      return this.mutateRaw(payloadData as any)
    }

    // Encrypt the request
    const { payload, session } = await encryptRequest(payloadData as any)

    // Send encrypted payload
    const response = await fetchAPI<{ iv: string; data: string; tag: string }>(
      apiHost,
      path,
      {
        method: 'POST',
        body: payload as unknown as Record<string, unknown>
      }
    )

    // Check if response is encrypted and decrypt it
    if (isEncryptedResponse(response)) {
      return await decryptResponse<InferRawOutput<T>>(response, session)
    }

    // If not encrypted (shouldn't happen with encrypted endpoints), return as-is
    return response as unknown as InferRawOutput<T>
  }

  /**
   * Constructs the endpoint path with query parameters if present.
   */
  protected _getPath(prefix?: string) {
    let endpoint = prefix ? `${prefix}/${this._route}` : `${this._route}`

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
