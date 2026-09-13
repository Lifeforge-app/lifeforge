import _ from 'lodash'

import { useModuleTranslation } from '@lifeforge/localization'
import { Box, Grid, Text, Widget, WithQueryData } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import HoursAndMinutesFromSeconds from './HoursAndMinutesFromSeconds'

const STAT_ICONS: Record<string, string> = {
  'Most time spent': 'tabler:coffee',
  'Total time spent': 'tabler:clock',
  'Average time spent': 'tabler:wave-saw-tool',
  'Longest streak': 'tabler:flame',
  'Current streak': 'tabler:flame'
}

function CodeTimeStatistics() {
  const { t } = useModuleTranslation()

  return (
    <WithQueryData
      contract={forgeAPI.getStatistics}
      queryOptions={{
        refetchInterval: 60 * 1000
      }}
    >
      {stats => (
        <Box gridColumnSpan={{ base: 1, lg: 2 }} width="100%">
          <Grid gap="sm" templateCols="repeat(auto-fit, minmax(14rem, 1fr))">
            <Widget
              icon="tabler:calendar"
              title="statisticType.timeSpentToday"
              variant="large-icon"
            >
              <Text size="4xl" weight="semibold">
                <HoursAndMinutesFromSeconds
                  seconds={stats['Time spent today']}
                />
              </Text>
            </Widget>
            {Object.entries(stats)
              .slice(0, -1)
              .map(([key, value], index) => (
                <Widget
                  key={key}
                  icon={STAT_ICONS[key]!}
                  iconColor={index === 3 ? 'orange-300' : undefined}
                  title={`statisticType.${_.camelCase(key)}`}
                  variant="large-icon"
                >
                  <Text size="4xl" weight="semibold" whiteSpace="nowrap">
                    {index < 3 ? (
                      <HoursAndMinutesFromSeconds seconds={value} />
                    ) : (
                      <>
                        {value}
                        <Text as="span" color="muted" pl="xs" size="3xl">
                          {t('units.days')}
                        </Text>
                      </>
                    )}
                  </Text>
                </Widget>
              ))}
          </Grid>
        </Box>
      )}
    </WithQueryData>
  )
}

export default CodeTimeStatistics
