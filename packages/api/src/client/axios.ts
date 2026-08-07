/* eslint-disable preserve-caught-error */
import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

import { clearAccessToken, getAccessToken, setAccessToken } from './tokenStore'

let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

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

function getHeader(headers: unknown, name: string): string | undefined {
  if (!headers || typeof headers !== 'object') return undefined

  const h = headers as Record<string, unknown>

  if (typeof h[name] === 'string') return h[name] as string

  const lowerName = name.toLowerCase()

  if (typeof h[lowerName] === 'string') return h[lowerName] as string

  if ('get' in h && typeof h.get === 'function') {
    const val = h.get(name) || h.get(lowerName)

    if (typeof val === 'string') return val
  }

  return undefined
}

export function createAxiosInstance(apiHost: string, isExternal: boolean) {
  const instance = axios.create({
    baseURL: isExternal ? undefined : apiHost,
    withCredentials: true
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

  instance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean
      }
      const response = error.response as AxiosResponse | undefined

      const skipRefreshPaths = ['/auth/refresh', '/auth/login', '/auth/logout']
      const requestPath = originalRequest.url?.split('?')[0] || ''

      // Reject early if:
      // 1. There is no response, or the HTTP status code is not 401.
      // 2. The target endpoint is external (not part of the LifeForge API).
      // 3. No request URL path is present.
      // 4. The path is an unauthenticated auth endpoint (login, refresh, or logout).
      // 5. This request is already a retry attempt (prevents infinite refresh loops).
      if (
        !response ||
        response.status !== 401 ||
        isExternal ||
        !requestPath ||
        skipRefreshPaths.includes(requestPath) ||
        originalRequest._retry
      ) {
        return Promise.reject(error)
      }

      originalRequest._retry = true

      const authHeader = getHeader(originalRequest.headers, 'Authorization')

      const sentToken =
        typeof authHeader === 'string'
          ? authHeader.replace(/^Bearer\s+/i, '')
          : null

      if (sentToken) {
        const currentToken = getAccessToken()

        if (sentToken !== currentToken) {
          if (currentToken) {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${currentToken}`
            }

            return instance(originalRequest)
          }
        } else {
          const refreshed = await refreshAccessToken(apiHost)

          if (refreshed) {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${getAccessToken()}`
            }

            return instance(originalRequest)
          }
        }
      } else {
        const token = getAccessToken()

        if (token) {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`
          }

          return instance(originalRequest)
        }
      }

      return Promise.reject(error)
    }
  )

  return instance
}
