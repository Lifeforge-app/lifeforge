import type { UseQueryResult } from '@tanstack/react-query'

import ErrorScreen from './ErrorScreen'
import LoadingScreen from './LoadingScreen'

function QueryWrapper<T>({
  query,
  children,
  showLoading = true
}: {
  query: UseQueryResult<T, Error>
  children: (data: T) => React.ReactElement | false
  showLoading?: boolean
}) {
  if (query.isLoading) {
    return showLoading ? <LoadingScreen /> : <></>
  }

  if (query.isError || query.data === undefined) {
    return <ErrorScreen message="Failed to fetch data from server." />
  }

  return <>{children(query.data as T)}</>
}

export default QueryWrapper
