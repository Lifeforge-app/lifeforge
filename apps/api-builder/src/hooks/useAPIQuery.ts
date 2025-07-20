/* eslint-disable @tanstack/query/exhaustive-deps */
import { type UseQueryOptions, useQuery } from '@tanstack/react-query'

import fetchAPI from '../utils/fetchAPI'

function useAPIQuery<T>(
  endpoint: string,
  key: unknown[],
  enabled = true,
  options: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> = {}
) {
  return useQuery<T>({
    ...options,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    queryKey: key,
    queryFn: () => fetchAPI(endpoint),
    enabled
  })
}

export default useAPIQuery
