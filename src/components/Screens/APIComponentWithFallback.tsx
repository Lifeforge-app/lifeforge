/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import Error from './Error'
import Loading from './Loading'

function APIComponentWithFallback<T>({
  data,
  children,
  showLoading = true
}: {
  data: 'loading' | 'error' | T
  children: (data: T) => React.ReactElement
  showLoading?: boolean
}): React.ReactElement {
  switch (data) {
    case 'loading':
      return showLoading ? <Loading /> : <></>
    case 'error':
      return <Error message="Failed to fetch data from server." />
    default:
      if (data) {
        return <>{children(data)}</>
      } else return <></>
  }
}

export default APIComponentWithFallback
