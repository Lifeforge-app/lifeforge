/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseQueryOptions } from '@tanstack/react-query'
import { fetchAPI } from 'shared'
import type {
  InferInput,
  InferOutput,
  FilteredRouteKey,
  RouteKeys,
  ControllerByRoute
} from '../typescript/forge_api_client.types'

import type { ForgeAPIServerControllerBase } from './forgeAPIServer'

export class ForgeAPIClientController<
  T extends ForgeAPIServerControllerBase = any
> {
  public __type!: T

  private _queryKey: unknown[] = []
  private _endpoint: string = ''
  private _input:
    | {
        params?: Record<string, any>
        query?: Record<string, any>
        body?: Record<string, any>
      }
    | undefined

  constructor(
    private _apiHost: string,
    private _route: string,
    private _method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  ) {}

  get queryKey() {
    return this._queryKey
  }

  get endpoint() {
    return this._endpoint
  }

  input(data: InferInput<T>) {
    this._input = data
    this._refreshEndpoint()

    this._queryKey = [
      this._method,
      this._route,
      this._input ? JSON.stringify(this._input) : null
    ].filter(Boolean)

    return this
  }

  getQueryOptions(
    options: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'> = {}
  ): UseQueryOptions<InferOutput<T>> {
    return {
      ...options,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      queryKey: this._queryKey,
      queryFn: () =>
        fetchAPI<InferOutput<T>>(this._apiHost, this._endpoint, {
          method: this._method,
          body: this._input?.body
        })
    }
  }

  private _refreshEndpoint() {
    this._endpoint = `${this._route}`

    if (this._input) {
      if (this._input.params) {
        for (const key in this._input.params) {
          this._endpoint = this._endpoint.replace(
            `:${key}`,
            this._input.params[key]
          )
        }
      }

      if (this._input.query) {
        const queryParams = new URLSearchParams(this._input.query).toString()

        this._endpoint += `?${queryParams}`
      }
    }
  }
}

export class ForgeAPIClient<Current> {
  constructor(
    private _apiHost: string,
    private _currentRoute: string = ''
  ) {}

  route<K extends FilteredRouteKey<Current>>(key: K) {
    return new ForgeAPIClient<Current[K]>(
      this._apiHost,
      `${this._currentRoute}${key as string}`
    )
  }

  controller<R extends RouteKeys<Current>>(key: R) {
    const splittedKey = (key as string).split(' ')

    if (splittedKey.length !== 2) {
      throw new Error(
        `Invalid route format: ${key as string}. Expected 'METHOD /path'`
      )
    }

    const method = splittedKey[0] as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

    const path = splittedKey[1]

    if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      throw new Error(`Invalid HTTP method: ${method}`)
    }

    return new ForgeAPIClientController<ControllerByRoute<Current, R>>(
      this._apiHost,
      `${this._currentRoute}${path}`,
      method
    )
  }
}
