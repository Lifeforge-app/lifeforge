/* eslint-disable preserve-caught-error */
import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

import {
  clearAccessToken,
  getAccessToken,
  setAccessToken
} from './authTokenStore'

interface ApiResponse<T> {
  state: 'success' | 'error'
  data?: T
  message?: string
}

let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

export class APIError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
  }
}

async function refreshAccessToken(apiHost: string): Promise<boolean> {
  if (isRefreshing) {
    return refreshPromise!
  }

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${apiHost}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      })

      const data = await res.json()

      if (res.ok && data.state === 'success' && data.data?.accessToken) {
        setAccessToken(data.data.accessToken)

        return true
      }

      clearAccessToken()

      return false
    } catch {
      clearAccessToken()

      return false
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

function createAxiosInstance(apiHost: string, isExternal: boolean) {
  const instance = axios.create({
    baseURL: isExternal ? undefined : apiHost,
    withCredentials: true,
    validateStatus: () => true
  })

  instance.interceptors.request.use(config => {
    if (!isExternal) {
      const token = getAccessToken()

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  })

  return instance
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
      throw new APIError(data.message || 'API returned an error', response.status)
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
    let response = await axiosInstance.request<T>(config)

    if (raw) {
      return response
    }

    if (
      response.status === 401 &&
      !isExternal &&
      !normalizedEndpoint.startsWith('/auth')
    ) {
      const hasAuthHeader = !!config.headers?.Authorization

      if (hasAuthHeader) {
        const refreshed = await refreshAccessToken(apiHost)

        if (refreshed) {
          const newConfig = { ...config }

          newConfig.headers = {
            ...newConfig.headers,
            Authorization: `Bearer ${getAccessToken()}`
          }

          response = await axiosInstance.request<T>(newConfig)
        }
      } else {
        const token = getAccessToken()

        if (token) {
          const newConfig = { ...config }

          newConfig.headers = {
            ...newConfig.headers,
            Authorization: `Bearer ${token}`
          }

          response = await axiosInstance.request<T>(newConfig)
        }
      }
    }

    return await handleAxiosResponse<T>(response, isExternal)
  } catch (err) {
    if (raiseError) {
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          throw new Error('Request timeout')
        }

        if (err.response) {
          let errorMessage = 'Failed to perform API request'

          try {
            if (
              err.response.data &&
              typeof err.response.data === 'object' &&
              'message' in err.response.data
            ) {
              errorMessage = err.response.data.message || errorMessage
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
