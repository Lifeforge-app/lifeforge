/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Icon } from '@iconify/react'
import React from 'react'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import HoursAndMinutesFromSeconds from './HoursAndMinutesFromSeconds'

function CodeTimeStatistics(): React.ReactElement {
  const [stats] = useFetch<Record<string, number>>('code-time/statistics')

  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="tabler:chart-bar" className="text-3xl" />
        <span className="ml-2">Statistics</span>
      </h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] items-center justify-between gap-4">
        <APIComponentWithFallback data={stats}>
          {typeof stats !== 'string' &&
            Object.entries(stats).map(([key, value], index) => (
              <div
                key={key}
                className="flex w-full flex-col items-start gap-2 rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900"
              >
                <div className="flex rounded-lg bg-bg-200/70 p-4 shadow-custom dark:bg-bg-800">
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
                        : 'text-bg-500 dark:text-bg-100'
                    }`}
                  />
                </div>
                <div className="text-lg text-bg-500">{key}</div>
                <div className="text-4xl font-semibold">
                  {index < 3 ? (
                    <HoursAndMinutesFromSeconds seconds={value} />
                  ) : (
                    <>
                      {value}
                      <span className="pl-1 text-3xl font-normal text-bg-500">
                        days
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
        </APIComponentWithFallback>
      </div>
    </div>
  )
}

export default CodeTimeStatistics
