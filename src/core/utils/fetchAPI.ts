import { cookieParse } from 'pocketbase'

interface ApiResponse<T> {
  state: 'success' | 'error'
  data?: T
  message?: string
}

interface CookieData {
  token?: string
}

function getRequestBody(body: any, isJSON: boolean): any {
  return isJSON ? JSON.stringify(body) : body
}

export default async function fetchAPI<T>(
  endpoint: string,
  {
    method = 'GET',
    body,
    timeout = 30000,
    raiseError = true
  }: {
    method?: string
    body?: string | FormData | URLSearchParams | Blob | Record<string, unknown>
    timeout?: number
    raiseError?: boolean
  } = {}
): Promise<T> {
  const apiHost = import.meta.env.VITE_API_HOST
  if (!apiHost) {
    throw new Error('VITE_API_HOST environment variable is not defined')
  }

  const isJSON =
    !!body &&
    !(
      body instanceof FormData ||
      body instanceof URLSearchParams ||
      body instanceof Blob
    )

  const cookies = cookieParse(document.cookie) as CookieData
  const token = cookies.token ?? ''

  try {
    const url = new URL(endpoint, apiHost)
    const response = await fetch(url.toString(), {
      method,
      signal: AbortSignal.timeout(timeout),
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        ...(isJSON ? { 'Content-Type': 'application/json' } : {})
      },
      body: body && getRequestBody(body, isJSON)
    })

    if (!response.ok) {
      const data = (await response.json()) as ApiResponse<T>
      throw new Error(data.message || 'Failed to perform API request')
    }

    if (response.status === 204) {
      return undefined as T
    }

    const data = (await response.json()) as ApiResponse<T>
    if (data.state === 'error') {
      throw new Error(data.message || 'API returned an error')
    }
    if (data.state === 'success') {
      return data.data as T
    }
    throw new Error('Unexpected API response format')
  } catch (err) {
    if (raiseError) {
      throw err instanceof Error
        ? err
        : new Error('Failed to perform API request')
    }
    return undefined as T
  }
}
