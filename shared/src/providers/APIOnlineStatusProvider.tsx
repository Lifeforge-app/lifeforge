import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

import { useAPIEndpoint } from './APIEndpointProvider'

async function checkAPIStatus(
  apiEndpoint: string
): Promise<'production' | 'development' | false> {
  const controller = new AbortController()

  const timeoutId = setTimeout(() => {
    controller.abort()
  }, 5000)

  return await fetch(`${apiEndpoint}/status`, {
    signal: controller.signal
  })
    .then(async res => {
      if (res.ok) {
        const data: any = await res.json()

        return data.data.environment
      }

      return false
    })
    .catch(() => false)
    .finally(() => {
      clearTimeout(timeoutId)
    })
}

interface IAPIOnlineStatus {
  isOnline: boolean | 'loading'
  environment: 'production' | 'development' | null
  retry: () => void
}

const APIOnlineStatusContext = createContext<IAPIOnlineStatus | undefined>(
  undefined
)

export default function APIOnlineStatusProvider({
  children
}: {
  children: React.ReactNode
}) {
  const apiEndpoint = useAPIEndpoint()

  const [isOnline, setIsOnline] = useState<boolean | 'loading'>('loading')

  const [environment, setEnvironment] = useState<
    'production' | 'development' | null
  >(null)

  const handleRetry = useCallback(() => {
    setIsOnline('loading')
    checkAPIStatus(apiEndpoint)
      .then(status => {
        setEnvironment(status === false ? null : status)
        setIsOnline(status !== false)
      })
      .catch(() => {
        setIsOnline(false)
      })
  }, [])

  useEffect(() => {
    handleRetry()
  }, [])

  return (
    <APIOnlineStatusContext
      value={{
        isOnline,
        environment,
        retry: handleRetry
      }}
    >
      {children}
    </APIOnlineStatusContext>
  )
}

export function useAPIOnlineStatus(): IAPIOnlineStatus {
  const context = useContext(APIOnlineStatusContext)

  if (context === undefined) {
    throw new Error(
      'useAPIOnlineStatus must be used within a APIOnlineStatusProvider'
    )
  }

  return context
}
