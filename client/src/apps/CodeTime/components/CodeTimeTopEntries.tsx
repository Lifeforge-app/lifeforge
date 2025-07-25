import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import { QueryWrapper } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import HoursAndMinutesFromSeconds from './HoursAndMinutesFromSeconds'

function CodeTimeTopEntries({ type }: { type: 'languages' | 'projects' }) {
  const { t } = useTranslation('apps.codeTime')

  const [lastFor, setLastFor] = useState<'24 hours' | '7 days' | '30 days'>(
    '24 hours'
  )

  const topEntriesQuery = useQuery(
    forgeAPI['code-time'][
      type === 'languages' ? 'getTopLanguages' : 'getTopProjects'
    ]
      .input({
        last: lastFor
      })
      .queryOptions()
  )

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center lg:gap-8">
        <h1 className="mb-2 flex shrink gap-2 text-2xl font-semibold">
          <Icon
            className="mt-0.5 shrink-0 text-3xl"
            icon={
              {
                languages: 'tabler:code',
                projects: 'tabler:clipboard'
              }[type]
            }
          />
          <span className="ml-2">{t(`headers.${type}`)}</span>
        </h1>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <p className="ml-2 shrink-0 font-medium tracking-wider sm:ml-0">
            {t('labels.inThePast')}
          </p>
          <div className="flex shrink-0 gap-2 rounded-lg p-2">
            {['24 hours', '7 days', '30 days'].map((last, index) => (
              <button
                key={index}
                className={clsx(
                  'rounded-md p-4 px-6 tracking-wide',
                  lastFor === last
                    ? 'bg-bg-200 text-bg-800 dark:bg-bg-700/50 dark:text-bg-50 font-semibold'
                    : 'text-bg-500 hover:bg-bg-100 dark:hover:bg-bg-700/50'
                )}
                onClick={() => {
                  setLastFor(last as '24 hours' | '7 days' | '30 days')
                }}
              >
                {last.split(' ')[0]}{' '}
                {t(`units.${last.split(' ')[1].toLowerCase()}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <QueryWrapper query={topEntriesQuery}>
        {topEntries => (
          <>
            <div className="flex w-full">
              {Object.keys(topEntries).length > 0 &&
                Object.entries(topEntries)
                  .slice(0, 5)
                  .map(([key, value], index) => (
                    <div
                      key={key}
                      className={clsx(
                        'h-6 border',
                        index === 0 && 'rounded-l-lg',
                        index ===
                          Object.entries(topEntries).slice(0, 5).length - 1 &&
                          'shrink-0 rounded-r-lg',
                        [
                          'border-red-500 bg-red-500/20',
                          'border-orange-500 bg-orange-500/20',
                          'border-yellow-500 bg-yellow-500/20',
                          'border-blue-500 bg-blue-500/20',
                          'border-emerald-500 bg-emerald-500/20'
                        ][index]
                      )}
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
            <ul className="space-y-4">
              {topEntries !== null &&
                Object.keys(topEntries).length > 0 &&
                Object.entries(topEntries)
                  .slice(0, 5)
                  .map(([key, value], index) => (
                    <li
                      key={key}
                      className="flex-between shadow-custom component-bg relative flex gap-8 rounded-lg p-6"
                    >
                      <div className="flex items-center gap-3 text-lg font-medium break-all">
                        <div
                          className={clsx(
                            'size-4 shrink-0 rounded-full rounded-md border',
                            [
                              'border-red-500 bg-red-500/20',
                              'border-orange-500 bg-orange-500/20',
                              'border-yellow-500 bg-yellow-500/20',
                              'border-blue-500 bg-blue-500/20',
                              'border-emerald-500 bg-emerald-500/20'
                            ][index]
                          )}
                        ></div>
                        {key}
                      </div>
                      <div className="shrink-0 text-3xl font-semibold">
                        <HoursAndMinutesFromSeconds seconds={value} />
                      </div>
                    </li>
                  ))}
            </ul>
          </>
        )}
      </QueryWrapper>
    </div>
  )
}

export default CodeTimeTopEntries
