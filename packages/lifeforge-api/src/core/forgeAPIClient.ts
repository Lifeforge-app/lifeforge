/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseQueryOptions } from '@tanstack/react-query'
import { fetchAPI } from 'shared'

import type {
  ClientTree,
  InferInput,
  InferOutput
} from '../typescript/forge_api_client.types'

function joinObjectsRecursively(
  target: Record<string, any>,
  source: Record<string, any>
): Record<string, any> {
  for (const key in source) {
    if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
      target[key] = joinObjectsRecursively(target[key] || {}, source[key])
    } else {
      target[key] = source[key]
    }
  }

  return target
}

export class ForgeAPIClientController<
  T extends { __isForgeController: true } = any
> {
  public __type!: T

  private _queryKey: unknown[] = []
  private _endpoint: string = ''
  private _input:
    | {
        query?: Record<string, any>
        body?: Record<string, any>
      }
    | undefined

  constructor(
    private _apiHost: string,
    private _route: string
  ) {
    this._refreshEndpoint()
  }

  get queryKey() {
    return this._queryKey
  }

  get endpoint() {
    return new URL(this._endpoint, this._apiHost).toString()
  }

  input(data: InferInput<T>) {
    this._input = joinObjectsRecursively(
      this._input || {},
      data as Record<string, any>
    )
    this._refreshEndpoint()

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
          method: 'get'
        })
    }
  }

  private _refreshEndpoint() {
    this._endpoint = `${this._route}`

    if (this._input && this._input.query) {
      const queryParams = new URLSearchParams(this._input.query)

      this._endpoint += `?${queryParams.toString()}`
    }

    this._queryKey = [
      this._route,
      this._input ? JSON.stringify(this._input) : null
    ].filter(Boolean)
  }
}

export function createForgeAPIClient<T>(
  apiHost: string,
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

    apply: (_, __, args) => {
      throw new Error(
        `Invalid function call on path: ${path.join(
          '.'
        )} — maybe you meant to use .input()?`
      )
    }
  }) as any
}
