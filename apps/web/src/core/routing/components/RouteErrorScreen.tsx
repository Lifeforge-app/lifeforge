import { useRouteError } from 'react-router'

import { ErrorScreen } from '@lifeforge/ui'

function RouteErrorScreen() {
  const error = useRouteError()

  return (
    <ErrorScreen
      message={
        error instanceof Error
          ? `Error: ${error.message}`
          : 'An unknown error occurred'
      }
    />
  )
}

export default RouteErrorScreen
