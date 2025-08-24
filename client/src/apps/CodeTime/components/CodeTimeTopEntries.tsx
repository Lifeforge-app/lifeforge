import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import { DashboardItem, WithQueryData } from 'lifeforge-ui'
import { useState } from 'react'

import HoursAndMinutesFromSeconds from './HoursAndMinutesFromSeconds'
import IntervalSelector from './IntervalSelector'

function CodeTimeTopEntries({ type }: { type: 'languages' | 'projects' }) {
  const [lastFor, setLastFor] = useState<'24 hours' | '7 days' | '30 days'>(
    '24 hours'
  )

  return (
    <DashboardItem
      className="h-min"
      componentBesideTitle={
        <IntervalSelector
          className="hidden md:flex"
          lastFor={lastFor}
          options={['24 hours', '7 days', '30 days']}
          setLastFor={setLastFor}
        />
      }
      icon={
        {
          languages: 'tabler:code',
          projects: 'tabler:clipboard'
        }[type]
      }
      namespace="apps.codeTime"
      title={type}
    >
      <IntervalSelector
        className="mb-4 flex md:hidden"
        lastFor={lastFor}
        options={['24 hours', '7 days', '30 days']}
        setLastFor={setLastFor}
      />
      <WithQueryData
        controller={forgeAPI['code-time'][
          type === 'languages' ? 'getTopLanguages' : 'getTopProjects'
        ].input({
          last: lastFor
        })}
      >
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
                      className="flex-between shadow-custom component-bg-lighter relative flex w-full min-w-0 flex-col gap-8 rounded-lg p-6 sm:flex-row"
                    >
                      <div className="flex w-full min-w-0 items-center gap-3 text-lg font-medium">
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
                        <span className="w-full min-w-0 truncate">{key}</span>
                      </div>
                      <div className="shrink-0 text-3xl font-semibold">
                        <HoursAndMinutesFromSeconds seconds={value} />
                      </div>
                    </li>
                  ))}
            </ul>
          </>
        )}
      </WithQueryData>
    </DashboardItem>
  )
}

export default CodeTimeTopEntries
