import { useQuery } from '@tanstack/react-query'
import { cloneElement, useState } from 'react'
import { ActivityCalendar } from 'react-activity-calendar'
import { Tooltip } from 'react-tooltip'

import {
  Box,
  EmptyStateScreen,
  Listbox,
  ListboxOption,
  Widget,
  WithQuery,
  anyColorToHex,
  surface,
  usePersonalization
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

const target = forgeAPI.getActivities

function CodeTimeActivityCalendar() {
  const { derivedTheme, derivedThemeColor: themeColor } = usePersonalization()
  const [year, setYear] = useState(new Date().getFullYear())

  const dataQuery = useQuery(
    target
      .input({
        year: year.toString()
      })
      .queryOptions({
        refetchInterval: 60 * 1000
      })
  )

  return (
    <Widget
      gridColumnSpan={{ base: 1, lg: 2 }}
      icon="tabler:activity"
      style={{ minHeight: 'min-content' }}
      title="activitiesCalendar"
    >
      <WithQuery query={dataQuery}>
        {({ data: activities, firstYear }) =>
          activities.length > 0 ? (
            <>
              <Listbox
                bg={surface.lightInteractive}
                value={year}
                onChange={setYear}
              >
                {Array(new Date().getFullYear() - firstYear + 1)
                  .fill(0)
                  .map((_, index) => (
                    <ListboxOption
                      key={index}
                      label={`${firstYear + index}`}
                      value={firstYear + index}
                    />
                  ))}
              </Listbox>
              <Box height="15rem" minWidth="0" width="100%">
                <ActivityCalendar
                  showWeekdayLabels
                  blockMargin={5}
                  blockSize={16}
                  colorScheme="dark"
                  data={activities}
                  labels={{
                    totalCount: `${
                      Math.floor(
                        activities.reduce((a, b) => a + b.count, 0) / 60
                      ) > 0
                        ? `${Math.floor(
                            activities.reduce((a, b) => a + b.count, 0) / 60
                          )} hours`
                        : ''
                    } ${
                      Math.floor(
                        activities.reduce((a, b) => a + b.count, 0) % 60
                      ) > 0
                        ? `${Math.floor(
                            activities.reduce((a, b) => a + b.count, 0) % 60
                          )} minutes`
                        : ''
                    } ${
                      activities.reduce((a, b) => a + b.count, 0) === 0
                        ? 'no time'
                        : ''
                    } spent on {{year}}`
                  }}
                  maxLevel={6}
                  renderBlock={(block, activity) =>
                    cloneElement(block, {
                      'data-tooltip-id': 'react-tooltip',
                      'data-tooltip-html': `${
                        Math.floor(activity.count / 60) > 0
                          ? `${Math.floor(activity.count / 60)} hours`
                          : ''
                      } ${
                        Math.floor(activity.count % 60) > 0
                          ? `${Math.floor(activity.count % 60)} minutes`
                          : ''
                      } ${activity.count === 0 ? 'no time' : ''} spent on ${
                        activity.date
                      }`.trim()
                    })
                  }
                  theme={{
                    dark: [
                      derivedTheme === 'dark'
                        ? 'rgb(38, 38, 38)'
                        : 'rgb(229, 229, 229)',
                      anyColorToHex(themeColor) || '#a9d066'
                    ]
                  }}
                />
              </Box>
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
      </WithQuery>
      <Tooltip id="react-tooltip" style={{ zIndex: 9999 }} />
    </Widget>
  )
}

export default CodeTimeActivityCalendar
