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
  ) {}

  get queryKey() {
    return this._queryKey
  }

  get endpoint() {
    return this._endpoint
  }

  input(data: InferInput<T>) {
    this._input = joinObjectsRecursively(
      this._input || {},
      data as Record<string, any>
    )
    this._refreshEndpoint()

    this._queryKey = [
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
          method: 'get'
        })
    }
  }

  private _refreshEndpoint() {
    this._endpoint = `${this._route}`

    if (this._input && this._input.query) {
      const queryParams = new URLSearchParams(this._input.query).toString()

      this._endpoint += `?${queryParams}`
    }
  }
}

export function createForgeAPIClient<T>(
  apiHost: string,
  path: string[] = []
): ClientTree<T> {
  return new Proxy(() => {}, {
    get: (_, prop) => {
      if (typeof prop === 'symbol' || prop === 'then') {
        return undefined
      }

      return createForgeAPIClient(apiHost, [...path, prop as string])
    },
    apply: (_, __, args) => {
      return new ForgeAPIClientController<
        T extends { __isForgeController: true } ? T : never
      >(apiHost, [...path, args[0]].join('/'))
    }
  }) as any
}
