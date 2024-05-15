import React from 'react'
import { type IChangeLogVersion } from '@typedec/Changelog'

function LogItemHeader({
  entry
}: {
  entry: IChangeLogVersion
}): React.ReactElement {
  return (
    <h3 className="mb-2 flex flex-col gap-2 text-2xl font-semibold sm:flex-row sm:items-end">
      Ver. {entry.version}{' '}
      <span className="mb-0.5 text-sm">
        (
        {entry.date_range
          .map(date =>
            new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          )
          .join(' - ')}
        )
      </span>
    </h3>
  )
}

export default LogItemHeader
