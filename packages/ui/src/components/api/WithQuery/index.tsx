import type { UseQueryResult } from '@tanstack/react-query'
import { useEffect } from 'react'
import type React from 'react'

import { APIError } from '@lifeforge/api'

import { ErrorScreen, LoadingScreen } from '@/components/feedback'

export function WithQuery<T>({
  query,
  children,
  showLoading = true,
  showRetryButton = true,
  loaderSize,
  notFoundFallback,
  onNotFound
}: {
  query: UseQueryResult<T, Error>
  children: (data: T) => React.ReactNode
  showLoading?: boolean
  showRetryButton?: boolean
  loaderSize?: string
  notFoundFallback?: React.ReactNode
  onNotFound?: () => void
}) {
  const is404 =
    query.isError &&
    query.error instanceof APIError &&
    query.error.status === 404

  useEffect(() => {
    if (is404) {
      onNotFound?.()
    }
  }, [is404, onNotFound])

  if (query.isPending) {
    return showLoading ? <LoadingScreen loaderSize={loaderSize} /> : null
  }

  if (query.isError) {
    if (is404 && notFoundFallback !== undefined) {
      return <>{notFoundFallback}</>
    }

    return (
      <ErrorScreen
        message={query.error.message}
        showRetryButton={showRetryButton}
      />
    )
  }

  if (query.data == null) {
    return null
  }

  return <>{children(query.data)}</>
}
