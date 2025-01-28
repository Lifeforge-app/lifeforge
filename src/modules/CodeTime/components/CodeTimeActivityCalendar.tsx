import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import ActivityCalendar from 'react-activity-calendar'
import { Tooltip } from 'react-tooltip'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import useThemeColors from '@hooks/useThemeColor'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'

function CodeTimeActivityCalendar(): React.ReactElement {
  const { theme } = usePersonalizationContext()
  const { theme: themeColor } = useThemeColors()
  const [year, setYear] = useState(new Date().getFullYear())
  const [data] = useFetch<{
    data: Array<{
      date: string
      count: number
      level: 0 | 1 | 2 | 3 | 4
    }>
    firstYear: number
  }>(`code-time/activities?year=${year}`)
  const [activities, setActivities] = useState<Array<{
    date: string
    count: number
    level: 0 | 1 | 2 | 3 | 4
  }> | null>(null)
  const [firstYear, setFirstYear] = useState<number>()

  useEffect(() => {
    if (typeof data !== 'string') {
      setActivities(data.data)
      setFirstYear(data.firstYear)
    }
  }, [data])

  return (
    <div className="space-y-8">
      <h1 className="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="tabler:activity" className="text-3xl" />
        <span className="ml-2">Activities Calendar</span>
      </h1>
      <div className="flex w-full items-center justify-between gap-6 overflow-x-auto">
        <div
          className={`flex flex-1 items-center${
            Array.isArray(activities) ? 'justify-start' : 'justify-center'
          }`}
        >
          <APIFallbackComponent data={data}>
            {() =>
              Array.isArray(activities) ? (
                <ActivityCalendar
                  data={activities}
                  blockSize={15}
                  blockMargin={5}
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
          </APIFallbackComponent>
        </div>
        <Tooltip id="react-tooltip" className="z-9999" />
        {firstYear && (
          <div className="space-y-2">
            {Array(new Date().getFullYear() - firstYear + 1)
              .fill(0)
              .map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setYear(firstYear + index)
                  }}
                  className={`flex items-start gap-2 rounded-lg p-4 px-8 font-medium sm:px-12 ${
                    year === firstYear + index
                      ? 'bg-bg-200 font-semibold text-bg-800 dark:bg-bg-700/50 dark:text-bg-50'
                      : 'text-bg-500 hover:bg-bg-100 dark:hover:bg-bg-700/50'
                  }`}
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
