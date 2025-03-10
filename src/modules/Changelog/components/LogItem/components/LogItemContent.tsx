import React from 'react'
import useThemeColors from '@hooks/useThemeColor'
import { type IChangeLogVersion } from '@interfaces/changelog_interfaces'

function LogItemContent({
  entry
}: {
  entry: IChangeLogVersion
}): React.ReactElement {
  const { componentBgLighter } = useThemeColors()
  return (
    <ul className="list-outside list-disc space-y-2">
      {entry.entries
        .sort((a, b) => a.feature.localeCompare(b.feature))
        .map(subEntry => (
          <li key={subEntry.id} className="ml-4 sm:ml-44">
            <div className="inline-flex flex-col items-start md:flex-row md:gap-2">
              <span className="font-semibold whitespace-nowrap">
                {subEntry.feature}:
              </span>{' '}
              <span
                className="text-bg-500 dark:text-bg-500"
                dangerouslySetInnerHTML={{
                  __html: subEntry.description.replace(
                    /<code>(.*?)<\/code>/g,
                    `
                                <code class="inline-block rounded-md p-1 px-1.5 font-['Jetbrains_Mono'] text-sm shadow-[2px_2px_2px_rgba(0,0,0,0.05)] ${componentBgLighter}">$1</code>
                                `
                  )
                }}
              />
            </div>
          </li>
        ))}
    </ul>
  )
}

export default LogItemContent
