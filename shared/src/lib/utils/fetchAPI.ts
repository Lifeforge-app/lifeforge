import { parse as parseCookie } from 'cookie'

interface ApiResponse<T> {
  state: 'success' | 'error'
  data?: T
  message?: string
}

function getRequestBody(body: any, isJSON: boolean): any {
  return isJSON ? JSON.stringify(body) : body
}

async function handleResponse<T>(
  response: Response,
  isExternal: boolean
): Promise<T> {
  if (!response.ok) {
    const data = (await response.json()) as ApiResponse<T>

    throw new Error(data.message || 'Failed to perform API request')
  }

  if (response.status === 204) {
    return undefined as T
  }

  if (isExternal) {
    return (await response.json()) as T
  }

  if (response.headers.get('Content-Type')?.includes('application/json')) {
    const data = (await response.json()) as ApiResponse<T>

    if (data.state === 'error') {
      throw new Error(data.message || 'API returned an error')
    }

    if (data.state === 'success') {
      return data.data as T
    }
  } else if (response.headers.get('x-lifeforge-downloadable') === 'true') {
    const buffer = await response.arrayBuffer()

    return new Uint8Array(buffer) as unknown as T
  } else if (response.headers.get('Content-Type')?.includes('text/plain')) {
    const text = await response.text()

    return text as unknown as T
  }

  throw new Error('Unexpected API response format')
}

export default async function fetchAPI<T>(
  apiHost: string,
  endpoint: string,
  {
    method = 'GET',
    body,
    timeout = 30000,
    raiseError = true,
    isExternal = false
  }: {
    method?: string
    body?: string | FormData | URLSearchParams | Blob | Record<string, unknown>
    timeout?: number
    raiseError?: boolean
    isExternal?: boolean
  } = {}
): Promise<T> {
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

  const cookies = parseCookie(document.cookie)

  const session = cookies.session ?? ''

  const url = isExternal ? new URL(endpoint) : new URL(endpoint, apiHost)

  try {
    const response = await fetch(url.toString(), {
      method,
      signal: AbortSignal.timeout(timeout),
      headers: {
        Authorization: !isExternal && session ? `Bearer ${session}` : '',
        ...(isJSON ? { 'Content-Type': 'application/json' } : {})
      },
      body: body && getRequestBody(body, isJSON)
    })

    return await handleResponse<T>(response, isExternal)
  } catch (err) {
    if (raiseError) {
      throw err instanceof Error
        ? err
        : new Error('Failed to perform API request')
    }

    return undefined as T
  }
}
