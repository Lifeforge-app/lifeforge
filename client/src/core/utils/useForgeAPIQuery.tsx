import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { fetchAPI, useAPIEndpoint } from 'shared'

function useForgeAPIQuery<T>({
  endpoint = '',
  method = 'GET',
  key = [],
  enabled = true,
  options
}: {
  endpoint: string
  key: unknown[]
  enabled?: boolean
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
}) {
  const APIEndpoint = useAPIEndpoint()

  return useQuery<T>({
    ...options,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    queryKey: key,
    queryFn: () =>
      fetchAPI<T>(APIEndpoint, endpoint, {
        method
      }),
    enabled
  })
}

export default useForgeAPIQuery
