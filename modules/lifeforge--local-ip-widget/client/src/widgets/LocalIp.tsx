import { useQuery } from '@tanstack/react-query'

import type { WidgetConfig } from '@lifeforge/configs'
import { Flex, Icon, Stack, Text, Widget, WithQuery } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

function LocalIp() {
  const localIpQuery = useQuery(forgeAPI.getLocalIp.queryOptions())

  return (
    <Widget icon="tabler:device-desktop-pin">
      <WithQuery loaderSize="1em" query={localIpQuery} showRetryButton={false}>
        {data => (
          <Stack height="100%">
            <Flex asChild align="center" as="header" gap="sm">
              <Text color="muted">
                <Icon icon="tabler:network" />
                <Text>Local IP Address</Text>
              </Text>
            </Flex>
            <Flex asChild centered flex="1" height="100%">
              <Text
                align="center"
                as="code"
                className="flex-center size-full flex-1 text-center text-lg"
                size="lg"
              >
                {data.addresses.length > 0
                  ? `${data.addresses[0]}`
                  : 'Unable to fetch local IP address.'}
              </Text>
            </Flex>
          </Stack>
        )}
      </WithQuery>
    </Widget>
  )
}

export default LocalIp

export const config: WidgetConfig = {
  id: 'localIpWidget',
  icon: 'tabler:device-desktop-pin',
  minH: 1,
  minW: 2
}
