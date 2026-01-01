import { createContext, useContext, useEffect, useState } from 'react'

import { hasServerPublicKey, initializeEncryption } from '../utils/encryption'

interface EncryptionProviderProps {
  apiHost: string
  children: React.ReactNode
}

const EncryptionStatusContext = createContext<
  | {
      ready: boolean
      error: string | null
    }
  | undefined
>(undefined)

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

  return (
    <EncryptionStatusContext value={{ ready, error }}>
      {children}
    </EncryptionStatusContext>
  )
}

export function useEncryption() {
  const context = useContext(EncryptionStatusContext)

  if (context === undefined) {
    throw new Error('useEncryption must be used within an EncryptionProvider')
  }

  return context
}
