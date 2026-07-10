import { type UseQueryOptions, useQuery } from '@tanstack/react-query'

import type { ForgeEndpoint, InferOutput } from '@lifeforge/api'

import { ErrorScreen, LoadingScreen } from '@/components/feedback'

export function WithQueryData<T extends ForgeEndpoint>({
  contract,
  queryOptions,
  children,
  showLoading = true,
  showRetryButton = true,
  loaderSize
}: {
  contract: T
  queryOptions?: Omit<UseQueryOptions, 'queryKey' | 'queryFn'> & {
    queryKey?: unknown[]
  }
  children: (data: InferOutput<T>) => React.ReactElement | false
  showLoading?: boolean
  showRetryButton?: boolean
  loaderSize?: string
}) {
  const query = useQuery(
    contract.queryOptions({
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
