import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

import {
  Button,
  EmptyStateScreen,
  LifeforgeUIProvider,
  LoadingScreen
} from '@lifeforge/ui'

import { initLocale } from '../i18n'

async function checkAPIStatus(): Promise<'production' | 'development' | false> {
  const controller = new AbortController()

  const timeoutId = setTimeout(() => {
    controller.abort()
  }, 5000)

  return await fetch(`${import.meta.env.VITE_API_HOST}/status`, {
    signal: controller.signal,
    cache: 'no-store'
  })
    .then(async res => {
      if (res.ok) {
        const data = await res.json()
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
}

const APIOnlineStatusContext = createContext<IAPIOnlineStatus | undefined>(
  undefined
)

export default function APIOnlineStatusProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [isOnline, setIsOnline] = useState<boolean | 'loading'>('loading')
  const [environment, setEnvironment] = useState<
    'production' | 'development' | null
  >(null)

  const onClickRetry = useCallback(() => {
    setIsOnline('loading')
    checkAPIStatus()
      .then(status => {
        if (status !== false) {
          initLocale()
        }
        setEnvironment(status === false ? null : status)
        setIsOnline(status !== false)
      })
      .catch(() => {
        setIsOnline(false)
      })
  }, [])

  useEffect(() => {
    onClickRetry()
  }, [])

  if (isOnline === 'loading') {
    return <LoadingScreen customMessage="Checking API status..." />
  }

  if (isOnline === false) {
    return (
      <LifeforgeUIProvider>
        <EmptyStateScreen
          customCTAButton={
            <Button
              className="bg-black! text-white!"
              icon="tabler:refresh"
              onClick={onClickRetry}
            >
              Retry
            </Button>
          }
          description="The API is currently offline. Please try again later. If you are the developer, please check the API status."
          icon="tabler:wifi-off"
          name={false}
          namespace={false}
          title="API is Offline"
        />
      </LifeforgeUIProvider>
    )
  }

  return (
    <APIOnlineStatusContext
      value={{
        isOnline,
        environment
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
