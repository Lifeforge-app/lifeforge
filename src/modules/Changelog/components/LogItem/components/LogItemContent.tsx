import React from 'react'
import { type IChangeLogVersion } from '@typedec/Changelog'

function LogItemContent({
  entry
}: {
  entry: IChangeLogVersion
}): React.ReactElement {
  return (
    <ul className="list-outside list-disc space-y-2">
      {entry.entries
        .sort((a, b) => a.feature.localeCompare(b.feature))
        .map(subEntry => (
          <li key={subEntry.id} className="ml-4 sm:ml-44">
            <div className="inline-flex flex-col items-start md:flex-row md:gap-2">
              <span className="whitespace-nowrap font-semibold">
                {subEntry.feature}:
              </span>{' '}
              <span
                className="text-bg-500 dark:text-bg-500"
                dangerouslySetInnerHTML={{
                  __html: subEntry.description.replace(
                    /<code>(.*?)<\/code>/g,
                    `
                                <code class="inline-block rounded-md bg-bg-200 p-1 px-1.5 font-['Jetbrains_Mono', text-sm shadow-[2px_2px_2px_rgba(0,0,0,0.05), dark:bg-bg-800">$1</code>
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
