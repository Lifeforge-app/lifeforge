import React, { createContext, useEffect, useState } from 'react'
import { Button } from '@components/buttons'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import { initLocale } from '../core/i18n'

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
}): React.ReactElement {
  const [isOnline, setIsOnline] = useState<boolean | 'loading'>('loading')
  const [environment, setEnvironment] = useState<
    'production' | 'development' | null
  >(null)

  useEffect(() => {
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

  return (
    <div className="flex-center h-dvh w-full">
      {isOnline === 'loading' ? (
        <span className="loader"></span>
      ) : isOnline ? (
        <APIOnlineStatusContext
          value={{
            isOnline,
            environment
          }}
        >
          {children}
        </APIOnlineStatusContext>
      ) : (
        <EmptyStateScreen
          icon="tabler:wifi-off"
          title="API is Offline"
          description="The API is currently offline. Please try again later. If you are the developer, please check the API status."
          customCTAButton={
            <Button
              icon="tabler:refresh"
              onClick={() => {
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
              }}
              needTranslate={false}
              className="!bg-black !text-white"
            >
              Retry
            </Button>
          }
        />
      )}
    </div>
  )
}

export function useAPIOnlineStatus(): IAPIOnlineStatus {
  const context = React.useContext(APIOnlineStatusContext)
  if (context === undefined) {
    throw new Error(
      'useAPIOnlineStatus must be used within a APIOnlineStatusProvider'
    )
  }
  return context
}
