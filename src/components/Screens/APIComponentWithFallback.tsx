/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import Error from './Error'
import Loading from './Loading'

function APIComponentWithFallback<T>({
  data,
  children
}: {
  data: 'loading' | 'error' | T
  children: (data: T) => React.ReactElement
}): React.ReactElement {
  switch (data) {
    case 'loading':
      return <Loading />
    case 'error':
      return <Error message="Failed to fetch data from server." />
    default:
      if (data) {
        return <>{children(data)}</>
      } else return <></>
  }
}

export default APIComponentWithFallback
