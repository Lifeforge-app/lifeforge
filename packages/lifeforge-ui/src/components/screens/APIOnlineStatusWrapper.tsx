import { useAPIOnlineStatus } from 'shared'

import EmptyStateScreen from './EmptyStateScreen'
import LoadingScreen from './LoadingScreen'

export default function APIOnlineStatusWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const { isOnline, retry } = useAPIOnlineStatus()

  if (isOnline === 'loading') {
    return <LoadingScreen message="Checking API status..." />
  }

  if (isOnline === false) {
    return (
      <EmptyStateScreen
        CTAButtonProps={{
          children: 'Retry',
          onClick: retry,
          icon: 'tabler:refresh'
        }}
        icon="tabler:wifi-off"
        message={{
          title: 'Cannot connect to API',
          description:
            'The API is currently offline. Please try again later. If you are the developer, please check the API status.'
        }}
      />
    )
  }

  return children
}
