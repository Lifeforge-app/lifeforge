/* eslint-disable @tanstack/query/exhaustive-deps */
import { useQuery } from '@tanstack/react-query'

import fetchAPI from '@utils/fetchAPI'

function useAPIQuery<T>(endpoint: string, key: unknown[]) {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => fetchAPI(endpoint)
  })
}

export default useAPIQuery
