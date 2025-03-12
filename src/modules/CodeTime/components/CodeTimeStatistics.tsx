import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { QueryWrapper } from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'
import useComponentBg from '@hooks/useComponentBg'

import HoursAndMinutesFromSeconds from './HoursAndMinutesFromSeconds'

function CodeTimeStatistics(): React.ReactElement {
  const { t } = useTranslation('modules.codeTime')
  const { componentBg, componentBgLighter } = useComponentBg()
  const statsQuery = useAPIQuery<Record<string, number>>(
    'code-time/statistics',
    ['code-time', 'statistics']
  )

  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
        <Icon className="text-3xl" icon="tabler:chart-bar" />
        <span className="ml-2">{t('headers.statistics')}</span>
      </h1>

      <QueryWrapper query={statsQuery}>
        {stats => (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-4">
            {Object.entries(stats).map(([key, value], index) => (
              <div
                key={key}
                className={clsx(
                  'flex-between shadow-custom flex w-full flex-col gap-2 rounded-lg p-3 sm:items-start sm:p-6',
                  componentBg
                )}
              >
                <div className="flex w-full flex-row items-center gap-2 sm:flex-col sm:items-start">
                  <div
                    className={clsx(
                      'shadow-custom flex rounded-lg p-2 sm:p-4',
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
                  <div className="text-bg-500 whitespace-nowrap text-lg">
                    {t(`statisticType.${_.camelCase(key)}`)}
                  </div>
                </div>
                <div className="mt-2 whitespace-nowrap text-4xl font-semibold">
                  {index < 3 ? (
                    <HoursAndMinutesFromSeconds seconds={value} />
                  ) : (
                    <>
                      {value}
                      <span className="text-bg-500 pl-1 text-3xl font-normal">
                        days
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </QueryWrapper>
    </div>
  )
}

export default CodeTimeStatistics
