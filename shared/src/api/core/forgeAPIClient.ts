/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'

import fetchAPI from '../../utils/fetchAPI'
import type {
  ClientTree,
  InferInput,
  InferOutput
} from '../typescript/forge_api_client.types'
import { getFormData, hasFile, joinObjectsRecursively } from './utils'

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
    return new URL(this._getPath(), this._apiHost).toString()
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
      queryFn: () =>
        fetchAPI<InferOutput<T>>(this._apiHost, this._getPath(), {
          method: 'get'
        })
    }
  }

  /**
   * Generates a React Query `UseMutationOptions` object for the current endpoint.
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
      mutationFn: (data: Partial<T>) => {
        return fetchAPI(this._apiHost, this._getPath(), {
          method: 'POST',
          body: hasFile(data) ? getFormData(data) : data
        })
      }
    }
  }

  /**
   * Triggers a GET request to the current endpoint.
   * @returns Promise resolving to the API response
   */
  query(options?: {
    method?: string
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
   * Triggers a POST request to the current endpoint.
   * @param data The body data for the request
   * @returns Promise resolving to the API response
   */
  mutate(data: InferInput<T>['body'] | FormData) {
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
   * Constructs the endpoint path with query parameters if present.
   */
  protected _getPath() {
    let endpoint = `${this._route}`

    if (this._input) {
      const queryParams = new URLSearchParams(
        Object.fromEntries(
          Object.entries(this._input).filter(([, value]) => value !== undefined)
        )
      )

      endpoint += `?${queryParams.toString()}`
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
): ClientTree<T> {
  const controller = new ForgeAPIClientController<
    T extends { __isForgeController: true } ? T : never
  >(apiHost, path.join('/'))

  return new Proxy(() => {}, {
    get: (_, prop: string) => {
      if (typeof prop === 'symbol' || prop === 'then') return undefined

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
