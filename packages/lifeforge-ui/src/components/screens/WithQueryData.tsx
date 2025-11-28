import { useQuery } from '@tanstack/react-query'
import type { ForgeAPIClientController, InferOutput } from 'shared'

import ErrorScreen from './ErrorScreen'
import LoadingScreen from './LoadingScreen'

function WithQueryData<T extends ForgeAPIClientController>({
  controller,
  children,
  showLoading = true,
  showRetryButton = true
}: {
  controller: T
  children: (data: InferOutput<T>) => React.ReactElement | false
  showLoading?: boolean
  showRetryButton?: boolean
}) {
  const query = useQuery(
    controller.queryOptions({
      retry: false
    })
  )

  if (query.isLoading || query.isEnabled === false) {
    return showLoading ? <LoadingScreen /> : <></>
  }

  if (query.isError) {
    return (
      <ErrorScreen
        message={
          query.error instanceof Error
            ? query.error.message
            : query.error || 'Failed to fetch data from server.'
        }
        showRetryButton={showRetryButton}
      />
    )
  }

  return <>{children(query.data as InferOutput<T>)}</>
}

export default WithQueryData
