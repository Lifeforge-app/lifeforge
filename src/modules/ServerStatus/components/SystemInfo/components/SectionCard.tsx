import { camelCaseToTitleCase, formatBytes } from '@utils/strings'
import clsx from 'clsx'
import React from 'react'

import useThemeColors from '@hooks/useThemeColor'

function SectionCard({
  key,
  title,
  value
}: {
  key: string
  title: string
  value: Record<string, unknown> | Record<string, unknown>[] | string
}): React.ReactElement {
  const { componentBg } = useThemeColors()

  return (
    <div
      className={clsx('shadow-custom space-y-4 rounded-lg p-6', componentBg)}
    >
      <h2 className="text-bg-500 text-xl">
        {title === 'mem' ? 'Memory' : camelCaseToTitleCase(title)}
      </h2>
      {!Array.isArray(value) ? (
        <ul className="divide-bg-200 dark:divide-bg-700 flex flex-col divide-y">
          {Object.entries(value).map(([k, v]) => (
            <li key={k} className="flex justify-between p-4">
              <span className="text-bg-500 text-lg">
                {camelCaseToTitleCase(k)}
              </span>
              <span className="text-bg-500 w-1/2 break-all text-lg">
                {(() => {
                  if (typeof v === 'object') {
                    return (
                      <ul className="divide-bg-200 dark:divide-bg-700 flex flex-col divide-y">
                        {Object.entries(v as any).map(([k, v]) => (
                          <li key={k} className="flex justify-between p-4">
                            <span className="text-bg-500 text-lg">
                              {camelCaseToTitleCase(k)}
                            </span>
                            <span className="text-bg-500 text-lg">
                              {formatBytes(v as any) || 'N/A'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )
                  }

                  if (key === 'mem') {
                    return formatBytes(v as any)
                  }

                  return String(v) || 'N/A'
                })()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        value.map((v, i) => (
          <ul
            key={i}
            className="divide-bg-200 dark:divide-bg-700 flex flex-col divide-y"
          >
            {Object.entries(v).map(([k, v]) => (
              <li key={k} className="flex justify-between p-4">
                <span className="text-bg-500 text-lg">
                  {camelCaseToTitleCase(k)}
                </span>
                <span className="text-bg-500 w-1/2 break-all text-lg">
                  {(k.includes('byte') &&
                    // @ts-expect-error - uhh lazy to fix for now =)
                    formatBytes(v)) ||
                    'N/A'}
                </span>
              </li>
            ))}
          </ul>
        ))
      )}
    </div>
  )
}

export default SectionCard
