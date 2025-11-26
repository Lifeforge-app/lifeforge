import type { UseQueryResult } from '@tanstack/react-query'

import ErrorScreen from './ErrorScreen'
import LoadingScreen from './LoadingScreen'

function WithQuery<T>({
  query,
  children,
  showLoading = true,
  showRetryButton = true
}: {
  query: UseQueryResult<T, Error>
  children: (data: T) => React.ReactElement | false
  showLoading?: boolean
  showRetryButton?: boolean
}) {
  if (query.isLoading) {
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

  return <>{children(query.data as T)}</>
}

export default WithQuery
