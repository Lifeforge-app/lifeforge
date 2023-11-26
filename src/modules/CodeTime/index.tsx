/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import ModuleHeader from '../../components/ModuleHeader'
import ActivityCalendar from 'react-activity-calendar'
import { Icon } from '@iconify/react'
import { Tooltip as ReactTooltip } from 'react-tooltip'

function HoursAndMinutesFromSeconds({
  seconds
}: {
  seconds: number
}): React.JSX.Element {
  return (
    <>
      {Math.floor(seconds / 60) > 0 ? (
        <>
          {Math.floor(seconds / 60)}
          <span className="pl-1 text-3xl font-normal text-neutral-500">h</span>
        </>
      ) : (
        ''
      )}{' '}
      {Math.floor(seconds % 60) > 0 ? (
        <>
          {Math.floor(seconds % 60)}
          <span className="pl-1 text-3xl font-normal text-neutral-500">m</span>
        </>
      ) : (
        ''
      )}{' '}
      {seconds === 0 ? 'no time' : ''}
    </>
  )
}

export default function CodeTime(): React.JSX.Element {
  const [activities, setActivities] = useState<
    Array<{ date: string; count: number }>
  >([])
  const [firstYear, setFirstYear] = useState(0)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [stats, setStats] = useState<Record<string, number>>()

  useEffect(() => {
    fetch('http://localhost:3000/api/activities?year=' + selectedYear)
      .then(async response => await response.json())
      .then(data => {
        setActivities(data.data)
        setFirstYear(data.firstYear)
      })
      .catch(() => {})

    fetch('http://localhost:3000/api/statistics')
      .then(async response => await response.json())
      .then(data => {
        setStats(data)
      })
      .catch(() => {})
  }, [])

  function switchSelectedYear(year: number): void {
    setSelectedYear(year)
    fetch('http://localhost:3000/api/activities?year=' + year)
      .then(async response => await response.json())
      .then(data => {
        setActivities(data.data)
        setFirstYear(data.firstYear)
      })
      .catch(() => {})
  }

  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col px-12">
      <ModuleHeader
        title="Code Time"
        desc="See how much time you spend grinding code."
      />
      <div className="flex min-h-0 w-full flex-1 flex-col items-center">
        {stats !== undefined && (
          <div className="mt-12 flex w-full flex-col gap-6">
            <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
              <Icon icon="tabler:chart-bar" className="text-3xl" />
              <span className="ml-2">Statistics</span>
            </h1>
            <div className="flex items-center justify-between gap-4">
              {Object.entries(stats).map(([key, value], index) => (
                <div
                  key={key}
                  className="flex w-full flex-col items-start gap-2 rounded-lg bg-neutral-800/50 p-6"
                >
                  <div className="flex rounded-lg bg-neutral-800 p-4">
                    <Icon
                      icon={
                        {
                          'Most time spent': 'tabler:coffee',
                          'Total time spent': 'tabler:clock',
                          'Average time spent': 'tabler:wave-saw-tool',
                          'Longest streak': 'tabler:flame',
                          'Current streak': 'tabler:flame'
                        }[key]!
                      }
                      className={`text-3xl ${
                        index === 3 ? 'text-orange-300' : 'text-neutral-100'
                      }`}
                    />
                  </div>
                  <div className="text-lg text-neutral-500">{key}</div>
                  <div className="text-4xl font-semibold text-neutral-50">
                    {index < 3 ? (
                      <HoursAndMinutesFromSeconds seconds={value} />
                    ) : (
                      <>
                        {value}
                        <span className="pl-1 text-3xl font-normal text-neutral-500">
                          days
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-12 flex w-full flex-col gap-6">
          <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
            <Icon icon="tabler:activity" className="text-3xl" />
            <span className="ml-2">Activities Calendar</span>
          </h1>
          <div className="flex items-center justify-between">
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
                dark: ['rgb(38, 38, 38)', 'rgb(20, 184, 166)']
              }}
            />
            <ReactTooltip id="react-tooltip" />
            {firstYear && (
              <div className="flex flex-col gap-2">
                {Array(new Date().getFullYear() - firstYear + 1)
                  .fill(0)
                  .map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        switchSelectedYear(firstYear + index)
                      }}
                      className={`flex items-start gap-2 p-4 px-8 font-medium ${
                        selectedYear === firstYear + index
                          ? 'rounded-lg bg-neutral-700/50 text-neutral-100'
                          : 'rounded-lg text-neutral-500 hover:bg-neutral-800/50 hover:text-neutral-100'
                      }`}
                    >
                      <span>{firstYear + index}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
