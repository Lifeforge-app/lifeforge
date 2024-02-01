import React from 'react'
import { type IChangeLogVersion } from '../../..'

function LogItemContent({
  entry
}: {
  entry: IChangeLogVersion
}): React.ReactElement {
  return (
    <ul className="flex list-inside list-disc flex-col gap-2 text-neutral-500 dark:text-neutral-400">
      {entry.entries.map(subEntry => (
        <li key={subEntry.id}>
          <span className="font-semibold text-neutral-800 dark:text-neutral-100">
            {subEntry.feature}:
          </span>{' '}
          <span
            dangerouslySetInnerHTML={{
              __html: subEntry.description.replace(
                /<code>(.*?)<\/code>/,
                `
                                <code class="inline-block rounded-md bg-neutral-200 p-1 px-1.5 font-['Jetbrains_Mono', text-sm shadow-[2px_2px_2px_rgba(0,0,0,0.05), dark:bg-neutral-800">$1</code>
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
