import clsx from 'clsx'
import React from 'react'
import useThemeColors from '@hooks/useThemeColor'
import { camelCaseToTitleCase, formatBytes } from '@utils/strings'

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
      className={clsx('space-y-4 rounded-lg p-6 shadow-custom', componentBg)}
    >
      <h2 className="text-xl text-bg-500">
        {title === 'mem' ? 'Memory' : camelCaseToTitleCase(title)}
      </h2>
      {!Array.isArray(value) ? (
        <ul className="flex flex-col divide-y divide-bg-200 dark:divide-bg-700">
          {Object.entries(value).map(([k, v]) => (
            <li key={k} className="flex justify-between p-4">
              <span className="text-lg text-bg-500">
                {camelCaseToTitleCase(k)}
              </span>
              <span className="w-1/2 break-all text-lg text-bg-500">
                {(() => {
                  if (typeof v === 'object') {
                    return (
                      <ul className="flex flex-col divide-y divide-bg-200 dark:divide-bg-700">
                        {Object.entries(v as any).map(([k, v]) => (
                          <li key={k} className="flex justify-between p-4">
                            <span className="text-lg text-bg-500">
                              {camelCaseToTitleCase(k)}
                            </span>
                            <span className="text-lg text-bg-500">
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
            className="flex flex-col divide-y divide-bg-200 dark:divide-bg-700"
          >
            {Object.entries(v).map(([k, v]) => (
              <li key={k} className="flex justify-between p-4">
                <span className="text-lg text-bg-500">
                  {camelCaseToTitleCase(k)}
                </span>
                <span className="w-1/2 break-all text-lg text-bg-500">
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
