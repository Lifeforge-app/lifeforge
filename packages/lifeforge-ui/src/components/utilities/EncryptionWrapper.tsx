import { useEncryption } from 'shared'

import { EmptyStateScreen, LoadingScreen } from '@components/feedback'

export default function EncryptionWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const { ready, error } = useEncryption()

  if (!ready) {
    return <LoadingScreen message="Checking API status..." />
  }

  if (error) {
    return (
      <EmptyStateScreen
        icon="tabler:lock-off"
        message={{
          title: 'Encryption failed',
          description:
            'Failed to initialize encryption. Please try again later.'
        }}
      />
    )
  }

  return children
}
