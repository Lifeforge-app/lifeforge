import { cookieParse } from 'pocketbase'

function getRequestBody(body: any, isJSON: boolean): any {
  return isJSON ? JSON.stringify(body) : body
}

export default async function fetchAPI<T>(
  endpoint: string,
  {
    method,
    body,
    timeout = 30000,
    raiseError = true
  }: {
    method?: string
    body?: any
    timeout?: number
    raiseError?: boolean
  } = {
    method: 'GET'
  }
): Promise<T> {
  const isJSON = !(
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob
  )

  try {
    const response = await fetch(
      [import.meta.env.VITE_API_HOST, endpoint].join('/').replace(/\/+/g, '/'),
      {
        method,
        signal: AbortSignal.timeout(timeout),
        headers: {
          Authorization: cookieParse(document.cookie).token
            ? `Bearer ${cookieParse(document.cookie).token}`
            : '',
          ...(isJSON ? { 'Content-Type': 'application/json' } : {})
        },
        body: body !== undefined ? getRequestBody(body, isJSON) : null
      }
    )

    if (!response.ok) {
      try {
        const data = await response.json().catch(() => {
          throw new Error('Failed to perform API request')
        })
        throw new Error(data.message)
      } catch (err: any) {
        throw new Error(err.message)
      }
    }

    const data = await response.json()

    switch (data.state) {
      case 'error':
        throw new Error(data.message)
      case 'success':
        return data.data
      default:
        throw new Error('Failed to perform API request')
    }
  } catch (err) {
    if (raiseError) {
      if (err instanceof Error) {
        throw new Error(err.message)
      } else {
        throw new Error('Failed to perform API request')
      }
    } else {
      return undefined as T
    }
  }
}
