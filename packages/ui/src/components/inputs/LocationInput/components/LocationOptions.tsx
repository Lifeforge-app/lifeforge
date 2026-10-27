import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'

import { useAPIEndpoint } from '@lifeforge/api'

import { WithQuery } from '@/components/api'
import { ComboboxOption } from '@/components/inputs'
import { Box, Text } from '@/components/primitives'
import { forgeAPI } from '@/utils/forgeAPI'

export function LocationOptions({
  query,
  enabled
}: {
  query: string
  enabled: boolean
}) {
  const apiHost = useAPIEndpoint()
  const debouncedQuery = useDebounce(query, 500)

  const dataQuery = useQuery(
    forgeAPI.locations.search
      .setHost(apiHost)
      .input({
        q: debouncedQuery
      })
      .queryOptions({
        enabled: debouncedQuery.trim() !== '' && enabled
      })
  )

  return (
    <WithQuery loaderSize="1.5em" query={dataQuery}>
      {locations =>
        locations.map(loc => (
          <ComboboxOption
            key={JSON.stringify(loc.location)}
            label={
              <Box minWidth="0" width="100%">
                <Text truncate>{loc.name}</Text>
                <Text
                  truncate
                  as="div"
                  color={{ base: 'bg-400', dark: 'bg-600' }}
                >
                  {loc.formattedAddress}
                </Text>
              </Box>
            }
            value={loc}
          />
        ))
      }
    </WithQuery>
  )
}
