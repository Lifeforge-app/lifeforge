import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import ActivityCalendar from 'react-activity-calendar'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'react-tooltip'
import QueryWrapper from '@components/screens/QueryWrapper'
import useAPIQuery from '@hooks/useAPIQuery'
import useThemeColors from '@hooks/useThemeColor'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'

function CodeTimeActivityCalendar(): React.ReactElement {
  const { t } = useTranslation('modules.codeTime')
  const { theme } = usePersonalizationContext()
  const { theme: themeColor } = useThemeColors()
  const [year, setYear] = useState(new Date().getFullYear())
  const dataQuery = useAPIQuery<{
    data: Array<{
      date: string
      count: number
      level: 0 | 1 | 2 | 3 | 4
    }>
    firstYear: number
  }>(`code-time/activities?year=${year}`, ['code-time', 'activities', year])
  const [activities, setActivities] = useState<Array<{
    date: string
    count: number
    level: 0 | 1 | 2 | 3 | 4
  }> | null>(null)
  const [firstYear, setFirstYear] = useState<number>()

  useEffect(() => {
    if (!dataQuery.isSuccess) {
      return
    }

    if (dataQuery.data) {
      setActivities(dataQuery.data.data)
      setFirstYear(dataQuery.data.firstYear)
    }
  }, [dataQuery.isSuccess, dataQuery.data])

  return (
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-semibold">
        <Icon className="text-3xl" icon="tabler:activity" />
        <span className="ml-2">{t('headers.activitiesCalendar')}</span>
      </h1>
      <div className="flex w-full items-center justify-between gap-6 overflow-x-auto">
        <div
          className={clsx(
            'flex flex-1 items-center pt-8',
            Array.isArray(activities) ? 'justify-start' : 'justify-center'
          )}
        >
          <QueryWrapper query={dataQuery}>
            {() =>
              Array.isArray(activities) ? (
                <ActivityCalendar
                  blockMargin={5}
                  blockSize={15}
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
                  renderBlock={(block, activity) =>
                    React.cloneElement(block, {
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
                      (theme === 'system' &&
                        window.matchMedia &&
                        window.matchMedia('(prefers-color-scheme: dark)')
                          .matches) ||
                      theme === 'dark'
                        ? 'rgb(38, 38, 38)'
                        : 'rgb(229, 229, 229)',
                      themeColor
                    ]
                  }}
                />
              ) : (
                <div className="text-bg-500">No activities found</div>
              )
            }
          </QueryWrapper>
        </div>
        <Tooltip className="z-9999" id="react-tooltip" />
        {firstYear && (
          <div className="space-y-2">
            {Array(new Date().getFullYear() - firstYear + 1)
              .fill(0)
              .map((_, index) => (
                <button
                  key={index}
                  className={clsx(
                    'flex items-start gap-2 rounded-lg p-4 px-8 font-medium sm:px-12',
                    year === firstYear + index
                      ? 'bg-bg-200 font-semibold text-bg-800 dark:bg-bg-700/50 dark:text-bg-50'
                      : 'text-bg-500 hover:bg-bg-100 dark:hover:bg-bg-700/50'
                  )}
                  onClick={() => {
                    setYear(firstYear + index)
                  }}
                >
                  <span>{firstYear + index}</span>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CodeTimeActivityCalendar
