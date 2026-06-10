import { useEffect, useState } from 'react'

export function I18nInitProvider({
  children,
  init,
  loadingFallback,
  errorFallback
}: {
  children: React.ReactNode
  init: () => Promise<unknown>
  loadingFallback: React.ReactNode
  errorFallback: React.ReactNode
}) {
  const [initialized, setInitialized] = useState<boolean | 'error'>(false)
  
useEffect(() => {
    init()
      .then(() => {
        setInitialized(true)
      })
      .catch((err: unknown) => {
        console.error('Failed to initialize i18n:', err)

        setInitialized('error')
      })
  }, [init])

  if (!initialized) {
    return loadingFallback
  }

  if (initialized === 'error') {
    return errorFallback
  }

  return children
}
