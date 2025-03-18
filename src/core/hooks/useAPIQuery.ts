/* eslint-disable @tanstack/query/exhaustive-deps */
import { useQuery } from '@tanstack/react-query'

import { fetchAPI } from '@lifeforge/core'

function useAPIQuery<T>(endpoint: string, key: unknown[], enabled = true) {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => fetchAPI(endpoint),
    enabled
  })
}

export default useAPIQuery
