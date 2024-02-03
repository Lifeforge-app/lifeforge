import React from 'react'
import { type IChangeLogVersion } from '../../..'

function LogItemContent({
  entry
}: {
  entry: IChangeLogVersion
}): React.ReactElement {
  return (
    <ul className="flex list-inside list-disc flex-col gap-2 text-bg-500 dark:text-bg-400">
      {entry.entries
        .sort((a, b) => a.feature.localeCompare(b.feature))
        .map(subEntry => (
          <li key={subEntry.id}>
            <span className="font-semibold text-bg-800 dark:text-bg-100">
              {subEntry.feature}:
            </span>{' '}
            <span
              dangerouslySetInnerHTML={{
                __html: subEntry.description.replace(
                  /<code>(.*?)<\/code>/,
                  `
                                <code class="inline-block rounded-md bg-bg-200 p-1 px-1.5 font-['Jetbrains_Mono', text-sm shadow-[2px_2px_2px_rgba(0,0,0,0.05), dark:bg-bg-800">$1</code>
                                `
                )
              }}
            />
          </li>
        ))}
    </ul>
  )
}

export default LogItemContent
