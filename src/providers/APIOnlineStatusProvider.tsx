import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import { initLocale } from '../i18n'

async function checkAPIStatus(): Promise<boolean> {
  const controller = new AbortController()

  const timeoutId = setTimeout(() => {
    console.log('API request timed out')
    controller.abort()
  }, 5000)

  return await fetch(`${import.meta.env.VITE_API_HOST}/status`, {
    signal: controller.signal
  })
    .then(res => res.ok)
    .catch(() => false)
    .finally(() => {
      clearTimeout(timeoutId)
    })
}

function APIOnlineStatusProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const [isOnline, setIsOnline] = useState<boolean | 'loading'>('loading')

  useEffect(() => {
    checkAPIStatus()
      .then(status => {
        setIsOnline(status)
        if (status) {
          initLocale()
        }
      })
      .catch(() => {
        setIsOnline(false)
      })
  }, [])

  return (
    <div className="flex-center flex h-dvh w-full">
      {isOnline === 'loading' ? (
        <Icon icon="svg-spinners:180-ring" className="text-4xl text-bg-500" />
      ) : isOnline ? (
        <>{children}</>
      ) : (
        <EmptyStateScreen
          icon="tabler:wifi-off"
          title="API is Offline"
          description="The API is currently offline. Please try again later. If you are the developer, please check the API status."
        />
      )}
    </div>
  )
}

export default APIOnlineStatusProvider
