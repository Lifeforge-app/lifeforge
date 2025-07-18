import { Button } from '@components/buttons'

import { useAPIOnlineStatus } from 'shared/lib'

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
        customCTAButton={
          <Button
            className="bg-black! text-white!"
            icon="tabler:refresh"
            onClick={retry}
          >
            Retry
          </Button>
        }
        description="The API is currently offline. Please try again later. If you are the developer, please check the API status."
        icon="tabler:wifi-off"
        name={false}
        namespace={false}
        title="API is Offline"
      />
    )
  }

  return children
}
