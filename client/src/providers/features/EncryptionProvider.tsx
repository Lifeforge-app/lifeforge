import { ErrorScreen, LoadingScreen } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { hasServerPublicKey, initializeEncryption } from 'shared'

interface EncryptionProviderProps {
  apiHost: string
  children: React.ReactNode
}

/**
 * Provider that initializes end-to-end encryption by fetching the server's public key.
 * Must be rendered after APIEndpointProvider and before any components that make API calls.
 */
export default function EncryptionProvider({
  apiHost,
  children
}: EncryptionProviderProps) {
  const [ready, setReady] = useState(hasServerPublicKey())

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (ready) return

    initializeEncryption(apiHost)
      .then(() => setReady(true))
      .catch(err => {
        console.error('Failed to initialize encryption:', err)
        setError(err.message)
      })
  }, [apiHost, ready])

  if (error) {
    return <ErrorScreen message="Failed to initialize encryption" />
  }

  if (!ready) {
    return <LoadingScreen message="Initializing encryption..." />
  }

  return <>{children}</>
}
