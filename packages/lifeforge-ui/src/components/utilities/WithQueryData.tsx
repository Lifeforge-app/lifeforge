import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import type { ForgeAPIClientController, InferOutput } from 'shared'

import { ErrorScreen, LoadingScreen } from '@components/feedback'

function WithQueryData<T extends ForgeAPIClientController>({
  controller,
  queryOptions,
  children,
  showLoading = true,
  showRetryButton = true,
  loaderSize
}: {
  controller: T
  queryOptions?: Omit<UseQueryOptions, 'queryKey' | 'queryFn'> & {
    queryKey?: unknown[]
  }
  children: (data: InferOutput<T>) => React.ReactElement | false
  showLoading?: boolean
  showRetryButton?: boolean
  loaderSize?: string
}) {
  const query = useQuery(
    controller.queryOptions({
      retry: false,
      ...queryOptions
    })
  )

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

  return <>{children(query.data as InferOutput<T>)}</>
}

export default WithQueryData
