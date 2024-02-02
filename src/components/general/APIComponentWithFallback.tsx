import React from 'react'
import Loading from './Loading'
import Error from './Error'

function APIComponentWithFallback({
  data,
  children
}: {
  data: 'loading' | 'error' | any
  children: React.ReactNode
}): React.ReactElement {
  switch (data) {
    case 'loading':
      return <Loading />
    case 'error':
      return <Error message="Failed to fetch data from server." />
    default:
      return <>{children}</>
  }
}

export default APIComponentWithFallback
