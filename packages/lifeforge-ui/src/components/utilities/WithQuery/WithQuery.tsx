import type { UseQueryResult } from '@tanstack/react-query'

import { ErrorScreen, LoadingScreen } from '@components/feedback'

function WithQuery<T>({
  query,
  children,
  showLoading = true,
  showRetryButton = true,
  loaderSize
}: {
  query: UseQueryResult<T, Error>
  children: (data: T) => React.ReactElement | false
  showLoading?: boolean
  showRetryButton?: boolean
  loaderSize?: string
}) {
  if (query.isLoading || query.isEnabled === false) {
    return showLoading ? <LoadingScreen loaderSize={loaderSize} /> : <></>
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
