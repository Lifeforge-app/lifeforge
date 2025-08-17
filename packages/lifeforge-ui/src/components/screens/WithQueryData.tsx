import { useQuery } from '@tanstack/react-query'
import type { ForgeAPIClientController, InferOutput } from 'shared'

import ErrorScreen from './ErrorScreen'
import LoadingScreen from './LoadingScreen'

function WithQueryData<T extends ForgeAPIClientController>({
  controller,
  children,
  showLoading = true
}: {
  controller: T
  children: (data: InferOutput<T>) => React.ReactElement | false
  showLoading?: boolean
}) {
  const query = useQuery(controller.queryOptions())

  if (query.isLoading || query.data === undefined) {
    return showLoading ? <LoadingScreen /> : <></>
  }

  if (query.isError) {
    return <ErrorScreen message="Failed to fetch data from server." />
  }

  return <>{children(query.data as InferOutput<T>)}</>
}

export default WithQueryData
