import { useEncryption } from '@lifeforge/shared'

import { EmptyStateScreen, LoadingScreen } from '@/components/feedback'

export function EncryptionWrapper({ children }: { children: React.ReactNode }) {
  const { ready, error } = useEncryption()

  if (!ready) {
    return <LoadingScreen message="Initializing end-to-end encryption..." />
  }

  if (error) {
    console.error('Encryption initialization error: ', error)

    return (
      <EmptyStateScreen
        icon="tabler:lock-off"
        message={{
          title: 'Encryption failed',
          description:
            'Failed to initialize encryption. Check the console for more details.'
        }}
      />
    )
  }

  return children
}
