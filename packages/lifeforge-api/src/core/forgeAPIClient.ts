/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
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

  private _key: unknown[] = []
  private _endpoint: string = ''
  private _input: Record<string, any> | undefined

  constructor(
    private _apiHost: string,
    private _route: string
  ) {
    this.refreshEndpoint()
  }

  get key() {
    return this._key
  }

  get endpoint() {
    return new URL(this._endpoint, this._apiHost).toString()
  }

  input(data: InferInput<T>['query']) {
    this._input = joinObjectsRecursively(
      this._input || {},
      data as Record<string, any>
    )
    this.refreshEndpoint()

    return this
  }

  queryOptions(
    options: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'> = {}
  ): UseQueryOptions<InferOutput<T>> {
    return {
      ...options,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      queryKey: this._key,
      queryFn: () =>
        fetchAPI<InferOutput<T>>(this._apiHost, this._endpoint, {
          method: 'get'
        })
    }
  }

  mutationOptions(
    options: Omit<
      UseMutationOptions<any, any, any>,
      'mutationKey' | 'mutationFn'
    > = {}
  ): UseMutationOptions<InferOutput<T>, any, InferInput<T>['body']> {
    return {
      ...options,
      mutationKey: this._key,
      mutationFn: async (data: Partial<T>) => {
        if (Object.values(data).some(value => value instanceof File)) {
          const formData = new FormData()

          const fileEntries: Record<string, File> = {}

          Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File) {
              fileEntries[key] = value
            } else if (typeof value !== 'string') {
              formData.append(key, JSON.stringify(value))
            } else {
              formData.append(key, value)
            }
          })

          Object.entries(fileEntries).forEach(([key, file]) => {
            formData.append(key, file)
          })

          return fetchAPI(this._apiHost, this._endpoint, {
            method: 'POST',
            body: formData
          })
        }

        return fetchAPI(this._apiHost, this._endpoint, {
          method: 'POST',
          body: data
        })
      }
    }
  }

  async query() {
    return await fetchAPI<InferOutput<T>>(this._apiHost, this._endpoint, {
      method: 'get'
    })
  }

  private refreshEndpoint() {
    this._endpoint = `${this._route}`

    if (this._input) {
      const queryParams = new URLSearchParams(
        Object.fromEntries(
          Object.entries(this._input).filter(([, value]) => value !== undefined)
        )
      )

      this._endpoint += `?${queryParams.toString()}`
    }

    this._key = [
      ...this._route.split('/').filter(Boolean),
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

    apply: () => {
      throw new Error(
        `Invalid function call on path: ${path.join(
          '.'
        )} — maybe you meant to use .input(), .queryOptions(), or .getMutationOptions()?`
      )
    }
  }) as any
}
