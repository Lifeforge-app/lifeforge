import { useEffect, useState } from 'react'

import { ErrorScreen, LoadingScreen } from '@lifeforge/ui'

import { initI18n } from '@/i18n'

export default function I18nInitProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [initialized, setInitialized] = useState<boolean | 'error'>(false)

  useEffect(() => {
    initI18n()
      .then(() => {
        setInitialized(true)
      })
      .catch(err => {
        console.error('Failed to initialize i18n:', err)

        setInitialized('error')
      })
  }, [])

  if (!initialized) {
    return <LoadingScreen message="Initializing localization..." />
  }

  if (initialized === 'error') {
    return (
      <ErrorScreen message="Failed to initialized localization service. Please check your i18n config." />
    )
  }

  return children
}
