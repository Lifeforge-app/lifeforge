import { useQuery } from '@tanstack/react-query'
import tinycolor from 'tinycolor2'

import { usePersonalization } from '@lifeforge/shared'
import type { WidgetConfig } from '@lifeforge/shared'
import {
  Box,
  Card,
  Icon,
  Text,
  WithQuery,
  colorWithOpacity
} from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

export default function Quotes() {
  const quoteQuery = useQuery<{ q: string; a: string }[]>(
    forgeAPI
      .corsAnywhere({
        url: 'https://zenquotes.io/api/random'
      })
      .queryOptions() as never
  )

  const { derivedThemeColor: themeColor } = usePersonalization()

  return (
    <Card
      centered
      bg="primary"
      gap="sm"
      height="100%"
      position="relative"
      style={{
        isolation: 'isolate'
      }}
    >
      <Box asChild position="absolute" right="1em" top="1em" zIndex="-1">
        <Icon
          color={colorWithOpacity('bg-800', '10%')}
          icon="tabler:quote"
          size="6em"
        />
      </Box>
      <Box
        asChild
        bottom="1em"
        left="1em"
        position="absolute"
        style={{
          transform: 'rotate(180deg)'
        }}
        zIndex="-1"
      >
        <Icon
          color={colorWithOpacity('bg-800', '10%')}
          icon="tabler:quote"
          size="6em"
        />
      </Box>
      <WithQuery query={quoteQuery}>
        {quote => (
          <Text
            align="center"
            as="p"
            color={tinycolor(themeColor).isLight() ? 'bg-800' : 'bg-100'}
            size={{ base: 'lg', sm: 'xl' }}
          >
            {quote?.length ? (
              <>
                {quote[0].q}
                <br />
                <Text
                  as="div"
                  color={colorWithOpacity('bg-800', '50%')}
                  mt="md"
                  size="base"
                  weight="medium"
                >
                  - {quote[0].a}
                </Text>
              </>
            ) : (
              <Text align="center">No quote for today :(</Text>
            )}
          </Text>
        )}
      </WithQuery>
    </Card>
  )
}

export const config: WidgetConfig = {
  id: 'quotes',
  icon: 'tabler:quote',
  minH: 2,
  minW: 2
}
