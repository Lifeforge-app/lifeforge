import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

interface ApiResponse<T> {
  state: 'success' | 'error'
  data?: T
  message?: string
}

function createAxiosInstance(apiHost: string, isExternal: boolean) {
  const instance = axios.create({
    baseURL: isExternal ? undefined : apiHost,
    validateStatus: () => true // We'll handle status validation manually
  })

  // Request interceptor for authentication
  instance.interceptors.request.use(config => {
    if (!isExternal) {
      const session = localStorage.getItem('session')

      if (session) {
        config.headers.Authorization = `Bearer ${session}`
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

    throw new Error(errorMessage)
  }

  if (response.status === 204) {
    return undefined as T
  }

  if (isExternal) {
    return response.data as T
  }

  const contentType = response.headers['content-type'] || ''

  if (contentType.includes('application/json')) {
    const data = response.data as ApiResponse<T>

    if (data.state === 'error') {
      throw new Error(data.message || 'API returned an error')
    }

    if (data.state === 'success') {
      return data.data as T
    }
  } else if (response.headers['x-lifeforge-downloadable'] === 'true') {
    // Axios automatically handles arrayBuffer as responseType
    return new Uint8Array(response.data) as unknown as T
  } else if (contentType.includes('text/plain')) {
    return response.data as unknown as T
  }

  throw new Error('Unexpected API response format')
}

export default async function fetchAPI<T>(
  apiHost: string,
  endpoint: string,
  {
    method = 'GET',
    body,
    headers: customHeaders,
    timeout = 300000,
    raiseError = true,
    isExternal = false
  }: {
    method?: string
    body?: string | FormData | URLSearchParams | Blob | Record<string, unknown>
    headers?: Record<string, string>
    timeout?: number
    raiseError?: boolean
    isExternal?: boolean
  } = {}
): Promise<T> {
  const axiosInstance = createAxiosInstance(apiHost, isExternal)

  // Determine the content type and prepare the request
  const isJSON =
    !!body &&
    !(
      body instanceof FormData ||
      body instanceof URLSearchParams ||
      body instanceof Blob
    )

  // Normalize endpoint path - ensure it starts with / for relative paths
  const normalizedEndpoint =
    endpoint.startsWith('/') || endpoint.startsWith('http')
      ? endpoint
      : `/${endpoint}`

  const config: AxiosRequestConfig = {
    method: method.toUpperCase() as
      | 'GET'
      | 'POST'
      | 'PUT'
      | 'DELETE'
      | 'PATCH'
      | 'HEAD'
      | 'OPTIONS',
    url: isExternal ? endpoint : normalizedEndpoint,
    timeout,
    data: body,
    headers: { ...customHeaders }
  }

  // Handle different body types
  if (body instanceof FormData) {
    config.headers!['Content-Type'] = 'multipart/form-data'
  } else if (body instanceof URLSearchParams) {
    config.headers!['Content-Type'] = 'application/x-www-form-urlencoded'
  } else if (body instanceof Blob) {
    config.headers!['Content-Type'] = 'application/octet-stream'
  } else if (isJSON) {
    config.headers!['Content-Type'] = 'application/json'
  }

  // Handle binary responses (downloadable files)
  if (!isExternal) {
    // We need to check for downloadable content, so we'll handle this in the response
    config.responseType = 'arraybuffer'
    config.transformResponse = [
      (data, headers) => {
        // If it's downloadable content, return as-is
        if (headers['x-lifeforge-downloadable'] === 'true') {
          return data
        }

        // Otherwise, try to parse as JSON or text
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

    return await handleAxiosResponse<T>(response, isExternal)
  } catch (err) {
    if (raiseError) {
      if (axios.isAxiosError(err)) {
        // Handle axios-specific errors
        if (err.code === 'ECONNABORTED') {
          throw new Error('Request timeout')
        }

        if (err.response) {
          // Server responded with error status
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
          throw new Error(errorMessage)
        }

        if (err.request) {
          // Request was made but no response received
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
