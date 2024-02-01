import React from 'react'
import { type IChangeLogVersion } from '../../..'

function LogItemHeader({
  entry
}: {
  entry: IChangeLogVersion
}): React.ReactElement {
  return (
    <h3 className="mb-2 flex flex-col gap-2 text-2xl font-semibold sm:flex-row sm:items-end">
      Ver. {entry.version}{' '}
      <span className="mb-0.5 block text-sm">
        (
        {new Date(entry.date_range[0]).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}{' '}
        -{' '}
        {new Date(entry.date_range[1]).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
        )
      </span>
    </h3>
  )
}

export default LogItemHeader
