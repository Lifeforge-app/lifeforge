/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'
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
  const [activities, setActivities] = useState<Array<{
    date: string
    count: number
    level: 0 | 1 | 2 | 3 | 4
  }> | null>(null)
  const [firstYear, setFirstYear] = useState(0)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [stats, setStats] = useState<Record<string, number>>()
  const [lastForProjects, setLastForProjects] = useState<
    '24 hours' | '7 days' | '30 days'
  >('24 hours')
  const [lastForLanguages, setLastForLanguages] = useState<
    '24 hours' | '7 days' | '30 days'
  >('24 hours')
  const [topProjects, setTopProjects] = useState<
    Array<{ name: string; count: number }>
  >([])
  const [topLanguages, setTopLanguages] = useState<
    Array<{ name: string; count: number }>
  >([])

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

    fetch(`${import.meta.env.VITE_API_HOST}/code-time/statistics`)
      .then(async response => await response.json())
      .then(data => {
        setStats(data.data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_HOST}/code-time/languages?last=` +
        lastForLanguages
    )
      .then(async response => await response.json())
      .then(data => {
        setTopLanguages(data.data)
      })
      .catch(() => {})
  }, [lastForLanguages])

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_HOST}/code-time/projects?last=` +
        lastForProjects
    )
      .then(async response => await response.json())
      .then(data => {
        setTopProjects(data.data)
      })
      .catch(() => {})
  }, [lastForProjects])

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

  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col px-12">
      <ModuleHeader
        title="Code Time"
        desc="See how much time you spend grinding code."
      />
      <div className="mt-8 flex min-h-0 w-full flex-1 flex-col items-center overflow-y-auto">
        {stats !== undefined && (
          <div className="flex w-full flex-col gap-6">
            <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
              <Icon icon="tabler:chart-bar" className="text-3xl" />
              <span className="ml-2">Statistics</span>
            </h1>
            <div className="flex items-center justify-between gap-4">
              {Object.entries(stats).map(([key, value], index) => (
                <div
                  key={key}
                  className="flex w-full flex-col items-start gap-2 rounded-lg bg-neutral-50 p-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-neutral-800/50"
                >
                  <div className="flex rounded-lg bg-neutral-200/70 p-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-neutral-800">
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
                        index === 3
                          ? 'text-orange-300'
                          : 'text-neutral-500 dark:text-neutral-100'
                      }`}
                    />
                  </div>
                  <div className="text-lg text-neutral-500">{key}</div>
                  <div className="text-4xl font-semibold text-neutral-800">
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
        <div className="mt-16 flex w-full flex-col gap-6">
          <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
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
                    // dark: ['rgb(38, 38, 38)', 'rgb(20, 184, 166)'],
                    dark: ['rgb(229, 229, 229)', 'rgb(20, 184, 166)']
                  }}
                />
              ) : (
                <Icon icon="svg-spinners:180-ring" className="text-4xl" />
              )}
            </div>
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
                      className={`flex items-start gap-2 rounded-lg p-4 px-8 sm:px-12 font-medium ${
                        selectedYear === firstYear + index
                          ? 'bg-neutral-200 font-semibold text-neutral-800 dark:bg-neutral-700/50 dark:text-neutral-100'
                          : 'text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50'
                      }`}
                    >
                      <span>{firstYear + index}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-16 flex w-full flex-col gap-6">
          <div className="flex w-full items-center justify-between">
            <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
              <Icon icon="tabler:clipboard" className="text-3xl" />
              <span className="ml-2">
                Projects You&apos;ve Spent Most Time Doing
              </span>
            </h1>
            <div className="flex items-center gap-2">
              <p className="font-medium tracking-wider">in the last</p>
              <div className="flex gap-2 rounded-lg p-2">
                {['24 hours', '7 days', '30 days'].map((last, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setLastForProjects(
                        last as '24 hours' | '7 days' | '30 days'
                      )
                    }}
                    className={`rounded-md p-4 px-6 tracking-wide ${
                      lastForProjects === last
                        ? 'bg-neutral-200 font-semibold text-neutral-800 dark:bg-neutral-700/50 dark:text-neutral-100'
                        : 'text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50'
                    }`}
                  >
                    {last}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex w-full">
            {Object.keys(topProjects).length > 0 &&
              Object.entries(topProjects)
                .slice(0, 5)
                .map(([key, value], index) => (
                  <div
                    className={`h-6 border ${index === 0 && 'rounded-l-lg'} ${
                      index === 4 && 'rounded-r-lg'
                    } ${
                      [
                        'bg-red-500/20 border-red-500',
                        'bg-orange-500/20 border-orange-500',
                        'bg-yellow-500/20 border-yellow-500',
                        'bg-blue-500/20 border-blue-500',
                        'bg-emerald-500/20 border-emerald-500'
                      ][index]
                    }`}
                    key={key}
                    style={{
                      width: `${Math.round(
                        (value /
                          Object.entries(topProjects)
                            .slice(0, 5)
                            .reduce((a, b) => a + b[1], 0)) *
                          100
                      )}%`
                    }}
                  ></div>
                ))}
          </div>
          <ul className="flex flex-col gap-4">
            {Object.keys(topProjects).length > 0 &&
              Object.entries(topProjects)
                .slice(0, 5)
                .map(([key, value], index) => (
                  <li
                    key={key}
                    className="relative flex items-center justify-between gap-4 rounded-lg bg-neutral-50 p-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-neutral-800/50"
                  >
                    <div className="flex items-center gap-4 text-lg font-medium text-neutral-800">
                      <div
                        className={`h-4 w-4 rounded-md border ${
                          [
                            'bg-red-500/20 border-red-500',
                            'bg-orange-500/20 border-orange-500',
                            'bg-yellow-500/20 border-yellow-500',
                            'bg-blue-500/20 border-blue-500',
                            'bg-emerald-500/20 border-emerald-500'
                          ][index]
                        } rounded-full`}
                      ></div>
                      {key}
                    </div>
                    <div className="text-3xl font-semibold text-neutral-800">
                      <HoursAndMinutesFromSeconds seconds={value} />
                    </div>
                  </li>
                ))}
          </ul>
        </div>
        <div className="mb-6 mt-16 flex w-full flex-col gap-6">
          <div className="flex w-full items-center justify-between">
            <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
              <Icon icon="tabler:code" className="text-3xl" />
              <span className="ml-2">
                Languages You&apos;ve Spent Most Time Using
              </span>
            </h1>
            <div className="flex items-center gap-2">
              <p className="font-medium tracking-wider">in the last</p>
              <div className="flex gap-2 rounded-lg p-2">
                {['24 hours', '7 days', '30 days'].map((last, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setLastForLanguages(
                        last as '24 hours' | '7 days' | '30 days'
                      )
                    }}
                    className={`rounded-md p-4 px-6 tracking-wide hover:bg-neutral-700/50 ${
                      lastForLanguages === last
                        ? 'bg-neutral-200 font-semibold text-neutral-800 dark:bg-neutral-700/50 dark:text-neutral-100'
                        : 'text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50'
                    }`}
                  >
                    {last}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex w-full">
            {Object.keys(topLanguages).length > 0 &&
              Object.entries(topLanguages)
                .slice(0, 5)
                .map(([key, value], index) => (
                  <div
                    className={`h-6 border ${index === 0 && 'rounded-l-lg'} ${
                      index === 4 && 'rounded-r-lg'
                    } ${
                      [
                        'bg-red-500/20 border-red-500',
                        'bg-orange-500/20 border-orange-500',
                        'bg-yellow-500/20 border-yellow-500',
                        'bg-blue-500/20 border-blue-500',
                        'bg-emerald-500/20 border-emerald-500'
                      ][index]
                    }`}
                    key={key}
                    style={{
                      width: `${Math.round(
                        (value /
                          Object.entries(topLanguages)
                            .slice(0, 5)
                            .reduce((a, b) => a + b[1], 0)) *
                          100
                      )}%`
                    }}
                  ></div>
                ))}
          </div>
          <ul className="flex flex-col gap-4">
            {Object.keys(topLanguages).length > 0 &&
              Object.entries(topLanguages)
                .slice(0, 5)
                .map(([key, value], index) => (
                  <li
                    key={key}
                    className="relative flex items-center justify-between gap-4 rounded-lg bg-neutral-50 p-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-neutral-800/50"
                  >
                    <div className="flex items-center gap-4 text-lg font-medium text-neutral-800">
                      <div
                        className={`h-4 w-4 rounded-md border ${
                          [
                            'bg-red-500/20 border-red-500',
                            'bg-orange-500/20 border-orange-500',
                            'bg-yellow-500/20 border-yellow-500',
                            'bg-blue-500/20 border-blue-500',
                            'bg-emerald-500/20 border-emerald-500'
                          ][index]
                        } rounded-full`}
                      ></div>
                      {key}
                    </div>
                    <div className="text-3xl font-semibold text-neutral-800">
                      <HoursAndMinutesFromSeconds seconds={value} />
                    </div>
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
