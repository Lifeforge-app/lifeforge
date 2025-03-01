import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import useThemeColors from '@hooks/useThemeColor'
import { toCamelCase } from '@utils/strings'
import HoursAndMinutesFromSeconds from './HoursAndMinutesFromSeconds'

function CodeTimeStatistics(): React.ReactElement {
  const { t } = useTranslation('modules.codeTime')
  const { componentBg, componentBgLighter } = useThemeColors()
  const [stats] = useFetch<Record<string, number>>('code-time/statistics')

  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
        <Icon className="text-3xl" icon="tabler:chart-bar" />
        <span className="ml-2">{t('headers.statistics')}</span>
      </h1>

      <APIFallbackComponent data={stats}>
        {stats => (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-4">
            {Object.entries(stats).map(([key, value], index) => (
              <div
                key={key}
                className={clsx(
                  'flex-between flex w-full flex-col gap-2 rounded-lg p-3 shadow-custom sm:items-start sm:p-6',
                  componentBg
                )}
              >
                <div className="flex w-full flex-row items-center gap-2 sm:flex-col sm:items-start">
                  <div
                    className={clsx(
                      'flex rounded-lg p-2 shadow-custom sm:p-4',
                      componentBgLighter
                    )}
                  >
                    <Icon
                      className={clsx(
                        'text-2xl sm:text-3xl',
                        index === 3
                          ? 'text-orange-300'
                          : 'text-bg-500 dark:text-bg-50'
                      )}
                      icon={
                        {
                          'Most time spent': 'tabler:coffee',
                          'Total time spent': 'tabler:clock',
                          'Average time spent': 'tabler:wave-saw-tool',
                          'Longest streak': 'tabler:flame',
                          'Current streak': 'tabler:flame'
                        }[key]!
                      }
                    />
                  </div>
                  <div className="whitespace-nowrap text-lg text-bg-500">
                    {t(`statisticType.${toCamelCase(key)}`)}
                  </div>
                </div>
                <div className="mt-2 whitespace-nowrap text-4xl font-semibold">
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
      </APIFallbackComponent>
    </div>
  )
}

export default CodeTimeStatistics
