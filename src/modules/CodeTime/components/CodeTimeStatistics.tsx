/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Icon } from '@iconify/react'
import React from 'react'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import useThemeColors from '@hooks/useThemeColor'
import HoursAndMinutesFromSeconds from './HoursAndMinutesFromSeconds'

function CodeTimeStatistics(): React.ReactElement {
  const { componentBg, componentBgLighter } = useThemeColors()
  const [stats] = useFetch<Record<string, number>>('code-time/statistics')

  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="tabler:chart-bar" className="text-3xl" />
        <span className="ml-2">Statistics</span>
      </h1>

      <APIComponentWithFallback data={stats}>
        {stats => (
          <div className="flex-between grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-4">
            {Object.entries(stats).map(([key, value], index) => (
              <div
                key={key}
                className={`flex-between flex w-full gap-2 rounded-lg p-6 shadow-custom sm:flex-col sm:items-start ${componentBg}`}
              >
                <div className="flex flex-row items-center gap-2 sm:flex-col sm:items-start">
                  <div
                    className={`flex rounded-lg p-4 shadow-custom ${componentBgLighter}`}
                  >
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
                          : 'text-bg-500 dark:text-bg-50'
                      }`}
                    />
                  </div>
                  <div className="whitespace-nowrap text-lg text-bg-500">
                    {key.replace('Average', 'Avg.')}
                  </div>
                </div>
                <div className="whitespace-nowrap text-4xl font-semibold">
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
          </div>
        )}
      </APIComponentWithFallback>
    </div>
  )
}

export default CodeTimeStatistics
