import { useState } from 'react'

import {
  Bordered,
  Box,
  COLORS,
  Card,
  EmptyStateScreen,
  Flex,
  Stack,
  Text,
  Widget,
  WithQueryData,
  colorWithOpacity,
  surface
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import HoursAndMinutesFromSeconds from './HoursAndMinutesFromSeconds'
import IntervalSelector from './IntervalSelector'

const BAR_STYLES = ['red', 'orange', 'yellow', 'blue', 'emerald'] as const

function CodeTimeTopEntries({ type }: { type: 'languages' | 'projects' }) {
  const [lastFor, setLastFor] = useState<'24 hours' | '7 days' | '30 days'>(
    '24 hours'
  )

  return (
    <Widget
      actionComponent={
        <IntervalSelector
          display={{ base: 'none', md: 'flex' }}
          lastFor={lastFor}
          options={['24 hours', '7 days', '30 days']}
          setLastFor={setLastFor}
        />
      }
      icon={
        {
          languages: 'tabler:code',
          projects: 'tabler:clipboard'
        }[type]
      }
      title={type}
    >
      <IntervalSelector
        display={{ base: 'flex', md: 'none' }}
        lastFor={lastFor}
        mb="md"
        options={['24 hours', '7 days', '30 days']}
        setLastFor={setLastFor}
      />
      <WithQueryData
        contract={forgeAPI[
          type === 'languages' ? 'getTopLanguages' : 'getTopProjects'
        ].input({
          last: lastFor
        })}
        queryOptions={{
          refetchInterval: 60 * 1000
        }}
      >
        {topEntries =>
          Object.keys(topEntries).length > 0 ? (
            <>
              <Flex width="100%">
                {Object.entries(topEntries)
                  .slice(0, 5)
                  .map(([key, value], index) => {
                    const entries = Object.entries(topEntries).slice(0, 5)
                    const total = entries.reduce((a, b) => a + b[1], 0)

                    return (
                      <Box
                        key={key}
                        bg={colorWithOpacity(`${BAR_STYLES[index]}-500`, '20%')}
                        height="1.5rem"
                        style={{
                          border: `1px solid ${COLORS[`${BAR_STYLES[index]}-500`]}`,
                          borderLeft:
                            index === 0
                              ? `1px solid ${COLORS[`${BAR_STYLES[index]}-500`]}`
                              : 'none',
                          borderTopLeftRadius: index === 0 ? '0.5rem' : 0,
                          borderBottomLeftRadius: index === 0 ? '0.5rem' : 0,
                          borderTopRightRadius:
                            index === entries.length - 1 ? '0.5rem' : 0,
                          borderBottomRightRadius:
                            index === entries.length - 1 ? '0.5rem' : 0
                        }}
                        width={`${Math.round((value / total) * 100)}%`}
                      />
                    )
                  })}
              </Flex>
              <Stack gap="sm">
                {Object.entries(topEntries)
                  .slice(0, 5)
                  .map(([key, value], index) => (
                    <Card
                      key={key}
                      align="center"
                      bg={surface.light}
                      direction={{ base: 'row', sm: 'row' }}
                      gap="lg"
                      justify="between"
                    >
                      <Flex align="center" gap="sm" minWidth="0" width="100%">
                        <Bordered
                          bg={colorWithOpacity(
                            `${BAR_STYLES[index]}-500`,
                            '20%'
                          )}
                          borderColor={`${BAR_STYLES[index]}-500`}
                          flexShrink="0"
                          height="1rem"
                          r="md"
                          width="1rem"
                        />
                        <Text truncate size="lg" weight="medium">
                          {key}
                        </Text>
                      </Flex>
                      <Box flexShrink="0">
                        <Text size="3xl" weight="semibold">
                          <HoursAndMinutesFromSeconds seconds={value} />
                        </Text>
                      </Box>
                    </Card>
                  ))}
              </Stack>
            </>
          ) : (
            <EmptyStateScreen
              icon="tabler:calendar-off"
              message={{
                id: 'activities'
              }}
            />
          )
        }
      </WithQueryData>
    </Widget>
  )
}

export default CodeTimeTopEntries
