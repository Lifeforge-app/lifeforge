import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import HoursAndMinutesFromSeconds from './HoursAndMinutesFromSeconds'

function CodeTimeTopEntries({
  type
}: {
  type: 'languages' | 'projects'
}): React.ReactElement {
  const [lastFor, setLastFor] = useState<'24 hours' | '7 days' | '30 days'>(
    '24 hours'
  )

  const [topEntries] = useFetch<Record<string, number>>(
    `code-time/${type}?last=${lastFor}`
  )

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center lg:gap-8">
        <h1 className="mb-2 flex shrink gap-2 text-2xl font-semibold">
          <Icon
            icon={
              {
                languages: 'tabler:code',
                projects: 'tabler:clipboard'
              }[type]
            }
            className="mt-0.5 shrink-0 text-3xl"
          />
          <span className="ml-2">
            {type[0].toUpperCase()}
            {type.slice(1)}
          </span>
        </h1>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <p className="ml-2 shrink-0 font-medium tracking-wider sm:ml-0">
            in the last
          </p>
          <div className="flex shrink-0 gap-2 rounded-lg p-2">
            {['24 hours', '7 days', '30 days'].map((last, index) => (
              <button
                key={index}
                onClick={() => {
                  setLastFor(last as '24 hours' | '7 days' | '30 days')
                }}
                className={`rounded-md p-4 px-6 tracking-wide hover:bg-bg-700/50 ${
                  lastFor === last
                    ? 'bg-bg-200 font-semibold text-bg-800 dark:bg-bg-700/50 dark:text-bg-100'
                    : 'text-bg-500 hover:bg-bg-200/50 dark:hover:bg-bg-700/50'
                }`}
              >
                {last}
              </button>
            ))}
          </div>
        </div>
      </div>
      <APIComponentWithFallback data={topEntries}>
        <div className="flex w-full">
          {typeof topEntries !== 'string' &&
            Object.keys(topEntries).length > 0 &&
            Object.entries(topEntries)
              .slice(0, 5)
              .map(([key, value], index) => (
                <div
                  className={`h-6 border ${index === 0 ? 'rounded-l-lg' : ''} ${
                    index ===
                      Object.entries(topEntries).slice(0, 5).length - 1 &&
                    'shrink-0 rounded-r-lg'
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
                        Object.entries(topEntries)
                          .slice(0, 5)
                          .reduce((a, b) => a + b[1], 0)) *
                        100
                    )}%`
                  }}
                ></div>
              ))}
        </div>
        <ul className="flex flex-col gap-4">
          {topEntries !== null &&
            Object.keys(topEntries).length > 0 &&
            Object.entries(topEntries)
              .slice(0, 5)
              .map(([key, value], index) => (
                <li
                  key={key}
                  className="relative flex items-center justify-between gap-8 rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900"
                >
                  <div className="flex items-center gap-4 break-all text-lg font-medium">
                    <div
                      className={`size-4 shrink-0 rounded-md border ${
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
                  <div className="shrink-0 text-3xl font-semibold">
                    <HoursAndMinutesFromSeconds seconds={value} />
                  </div>
                </li>
              ))}
        </ul>
      </APIComponentWithFallback>
    </div>
  )
}

export default CodeTimeTopEntries
