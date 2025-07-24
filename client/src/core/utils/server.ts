/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RouterInput } from '@server/core/functions/routes/typescript/forge_router.types'
import type { Router } from '@server/core/routes'
import { UseQueryOptions } from '@tanstack/react-query'
import {
  type ForgeControllerBuilderBase,
  type ZodObjectOrIntersection,
  fetchAPI
} from 'shared'
import { z } from 'zod/v4'

export type InferInput<T> =
  T extends ForgeControllerBuilderBase<string, infer I, any>
    ? I extends Record<string, ZodObjectOrIntersection>
      ? {
          [K in keyof I]: I[K] extends ZodObjectOrIntersection
            ? z.infer<I[K]>
            : never
        }
      : never
    : never

export type InferOutput<T> =
  T extends ForgeControllerBuilderBase<string, any, infer O> ? O : never

type FilteredRouteKey<T> = {
  [K in keyof T]: T[K] extends ForgeControllerBuilderBase ? never : K
}[keyof T]

type RouteNameMap<T> = {
  [K in keyof T]: T[K] extends ForgeControllerBuilderBase<infer R, any, any>
    ? R extends string
      ? [R, K]
      : never
    : never
}[keyof T]

type RouteToKeyMap<T> = {
  [P in RouteNameMap<T> as P[0]]: P[1]
}

type RouteKeys<T> = keyof RouteToKeyMap<T>

type ControllerByRoute<
  T,
  R extends RouteKeys<T>,
  K extends keyof T = RouteToKeyMap<T>[R] & keyof T
> =
  T[K] extends ForgeControllerBuilderBase<infer R, any, any>
    ? R extends string
      ? T[K]
      : never
    : never

class ControllerBuilder<T extends ForgeControllerBuilderBase> {
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
    private _route: string,
    private _method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  ) {}

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
        fetchAPI<InferOutput<T>>(import.meta.env.VITE_API_HOST, this._endpoint)
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

class APIBuilder<Current extends RouterInput> {
  constructor(private _currentRoute: string = '') {}

  route<K extends FilteredRouteKey<Current>>(key: K) {
    return new APIBuilder<Current[K] extends RouterInput ? Current[K] : never>(
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

    return new ControllerBuilder<ControllerByRoute<Current, R>>(
      `${this._currentRoute}${path}`,
      method
    )
  }
}

const forgeAPI = new APIBuilder<Router>()

export default forgeAPI
