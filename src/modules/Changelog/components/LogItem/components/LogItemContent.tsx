import React from 'react'
import { type IChangeLogVersion } from '@typedec/Changelog'

function LogItemContent({
  entry
}: {
  entry: IChangeLogVersion
}): React.ReactElement {
  return (
    <ul className="list-inside list-disc space-y-2">
      {entry.entries
        .sort((a, b) => a.feature.localeCompare(b.feature))
        .map(subEntry => (
          <li key={subEntry.id}>
            <span className="font-semibold">{subEntry.feature}:</span>{' '}
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
          </li>
        ))}
    </ul>
  )
}

export default LogItemContent
