import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'
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
}): React.ReactElement {
  if (query.isLoading) {
    return showLoading ? <LoadingScreen /> : <></>
  }

  if (query.isError || query.data === undefined) {
    return <ErrorScreen message="Failed to fetch data from server." />
  }

  return <>{children(query.data)}</>
}

export default QueryWrapper
