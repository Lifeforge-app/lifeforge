/* eslint-disable preserve-caught-error */
import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

import { createAxiosInstance } from './axios'

interface ApiResponse<T> {
  state: 'success' | 'error'
  data?: T
  message?: string
}

export class APIError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
  }
}

async function handleAxiosResponse<T>(
  response: AxiosResponse,
  isExternal: boolean
): Promise<T> {
  if (!response.status || response.status >= 400) {
    let errorMessage = 'Failed to perform API request'

    try {
      if (
        response.data &&
        typeof response.data === 'object' &&
        'message' in response.data
      ) {
        errorMessage = response.data.message || errorMessage
      }
    } catch {
      // Ignore parsing errors, use default message
    }

    throw new APIError(errorMessage, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  if (isExternal) {
    return response.data as T
  }

  const contentType = String(response.headers['content-type'] || '')

  if (contentType.includes('application/json')) {
    const data = response.data as ApiResponse<T>

    if (data.state === 'error') {
      throw new APIError(
        data.message || 'API returned an error',
        response.status
      )
    }

    if (data.state === 'success') {
      return data.data as T
    }
  } else if (response.headers['x-lifeforge-downloadable'] === 'true') {
    return new Uint8Array(response.data) as unknown as T
  } else if (contentType.includes('text/plain')) {
    return response.data as unknown as T
  }

  throw new APIError('Unexpected API response format', response.status)
}

export type FetchAPIOptions = {
  method?: string
  body?: string | FormData | URLSearchParams | Blob | Record<string, unknown>
  raiseError?: boolean
  isExternal?: boolean
} & Omit<AxiosRequestConfig, 'method' | 'url' | 'data'>

export type ResponseWrapper<T> =
  { state: 'success'; data: T } | { state: 'error'; message: string }

export async function fetchAPI<T>(
  apiHost: string,
  endpoint: string,
  options: FetchAPIOptions & { raw: true }
): Promise<AxiosResponse<ResponseWrapper<T>>>

export async function fetchAPI<T>(
  apiHost: string,
  endpoint: string,
  options?: FetchAPIOptions & { raw?: false }
): Promise<T>

export async function fetchAPI<T>(
  apiHost: string,
  endpoint: string,
  {
    raw = false,
    method = 'GET',
    body,
    raiseError = true,
    isExternal = false,
    ...overrides
  }: FetchAPIOptions & { raw?: boolean } = {}
): Promise<AxiosResponse<T> | T> {
  const axiosInstance = createAxiosInstance(apiHost, isExternal)

  const isJSON =
    !!body &&
    !(
      body instanceof FormData ||
      body instanceof URLSearchParams ||
      body instanceof Blob
    )

  const normalizedEndpoint = (
    endpoint.startsWith('/') || endpoint.startsWith('http')
      ? endpoint
      : `/${endpoint}`
  ).replace(/\$/g, '__')

  const mergedHeaders = { ...(overrides.headers || {}) }
  const overrideTimeout = overrides.timeout ?? 300000

  const config: AxiosRequestConfig = {
    ...overrides,
    method: method.toUpperCase() as
      'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS',
    url: isExternal ? endpoint : normalizedEndpoint,
    timeout: overrideTimeout,
    data: body,
    headers: mergedHeaders,
    withCredentials: true
  }

  if (body instanceof FormData) {
    config.headers!['Content-Type'] = 'multipart/form-data'
  } else if (body instanceof URLSearchParams) {
    config.headers!['Content-Type'] = 'application/x-www-form-urlencoded'
  } else if (body instanceof Blob) {
    config.headers!['Content-Type'] = 'application/octet-stream'
  } else if (isJSON) {
    config.headers!['Content-Type'] = 'application/json'
  }

  if (!isExternal) {
    config.responseType = 'arraybuffer'
    config.transformResponse = [
      (data, headers) => {
        if (headers['x-lifeforge-downloadable'] === 'true') {
          return data
        }

        try {
          const text = new TextDecoder().decode(data)

          return JSON.parse(text)
        } catch {
          return new TextDecoder().decode(data)
        }
      }
    ]
  }

  try {
    const response = await axiosInstance.request<T>(config)

    if (raw) return response

    return await handleAxiosResponse<T>(response, isExternal)
  } catch (err) {
    if (raiseError) {
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          throw new Error('Request timeout')
        }

        if (err.response) {
          let errorMessage = 'Failed to perform API request'
          let data = err.response.data

          if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
            try {
              const text = new TextDecoder().decode(data)
              data = JSON.parse(text)
            } catch {
              try {
                data = new TextDecoder().decode(data)
              } catch {}
            }
          }

          try {
            if (
              data &&
              typeof data === 'object' &&
              'message' in data &&
              typeof (data as Record<string, unknown>).message === 'string'
            ) {
              errorMessage = (data as Record<string, unknown>).message as string
            }
          } catch {
            // Ignore parsing errors
          }

          throw new APIError(errorMessage, err.response.status)
        }

        if (err.request) {
          throw new Error('Network error: No response received')
        }
      }

      throw err instanceof Error
        ? err
        : new Error('Failed to perform API request')
    }

    return undefined as T
  }
}
