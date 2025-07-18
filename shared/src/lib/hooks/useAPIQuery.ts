import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useAPIEndpoint } from "../providers/APIEndpointProvider";
import fetchAPI from "../utils/fetchAPI";

function useAPIQuery<T>(
  endpoint: string,
  key: unknown[],
  enabled = true,
  options: Omit<UseQueryOptions<T>, "queryKey" | "queryFn"> = {},
) {
  const APIEndpoint = useAPIEndpoint();

  return useQuery<T>({
    ...options,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    queryKey: key,
    queryFn: () => fetchAPI<T>(APIEndpoint, endpoint),
    enabled,
  });
}

export default useAPIQuery;
