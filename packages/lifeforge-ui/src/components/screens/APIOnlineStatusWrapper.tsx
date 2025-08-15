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
    return <LoadingScreen customMessage="Checking API status..." />
  }

  if (isOnline === false) {
    return (
      <EmptyStateScreen
        CTAButtonProps={{
          children: 'Retry',
          onClick: retry,
          icon: 'tabler:refresh'
        }}
        description="The API is currently offline. Please try again later. If you are the developer, please check the API status."
        icon="tabler:wifi-off"
        name={false}
        title="API is Offline"
      />
    )
  }

  return children
}
