/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
import { Icon } from '@iconify/react'
import React, { useContext, useEffect, useState } from 'react'
import ActivityCalendar from 'react-activity-calendar'
import { Tooltip } from 'react-tooltip'
import { PersonalizationContext } from '@providers/PersonalizationProvider'
import THEME_COLOR_HEX from '../../../constants/theme_color_hex'

function CodeTimeActivityCalendar(): React.ReactElement {
  const { theme, themeColor } = useContext(PersonalizationContext)
  const [activities, setActivities] = useState<Array<{
    date: string
    count: number
    level: 0 | 1 | 2 | 3 | 4
  }> | null>(null)
  const [firstYear, setFirstYear] = useState(0)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  function switchSelectedYear(year: number): void {
    setSelectedYear(year)
    setActivities(null)
    fetch(`${import.meta.env.VITE_API_HOST}/code-time/activities?year=` + year)
      .then(async response => await response.json())
      .then(data => {
        setActivities(data.data.data.length > 0 ? data.data.data : null)
        setFirstYear(data.data.firstYear)
      })
      .catch(() => {})
  }

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_HOST}/code-time/activities?year=` +
        selectedYear
    )
      .then(async response => await response.json())
      .then(data => {
        setActivities(data.data.data)
        setFirstYear(data.data.firstYear)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-2">
      <h1 className="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="tabler:activity" className="text-3xl" />
        <span className="ml-2">Activities Calendar</span>
      </h1>
      <div className="flex items-center justify-between">
        <div
          className={`flex flex-1 items-center ${
            Array.isArray(activities) ? 'justify-start' : 'justify-center'
          }`}
        >
          {Array.isArray(activities) ? (
            <ActivityCalendar
              data={activities}
              blockSize={14}
              blockMargin={6}
              labels={{
                totalCount: `${
                  Math.floor(activities.reduce((a, b) => a + b.count, 0) / 60) >
                  0
                    ? `${Math.floor(
                        activities.reduce((a, b) => a + b.count, 0) / 60
                      )} hours`
                    : ''
                } ${
                  Math.floor(activities.reduce((a, b) => a + b.count, 0) % 60) >
                  0
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
                  THEME_COLOR_HEX[
                    themeColor.replace(
                      'theme-',
                      ''
                    ) as keyof typeof THEME_COLOR_HEX
                  ]
                ]
              }}
            />
          ) : (
            <Icon icon="svg-spinners:180-ring" className="text-4xl" />
          )}
        </div>
        <Tooltip id="react-tooltip" className="z-[9999]" />
        {firstYear && (
          <div className="space-y-2">
            {Array(new Date().getFullYear() - firstYear + 1)
              .fill(0)
              .map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    switchSelectedYear(firstYear + index)
                  }}
                  className={`flex items-start gap-2 rounded-lg p-4 px-8 font-medium sm:px-12 ${
                    selectedYear === firstYear + index
                      ? 'bg-bg-200 font-semibold text-bg-800 dark:bg-bg-700/50 dark:text-bg-100'
                      : 'text-bg-500 hover:bg-bg-200/50 dark:hover:bg-bg-700/50'
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
