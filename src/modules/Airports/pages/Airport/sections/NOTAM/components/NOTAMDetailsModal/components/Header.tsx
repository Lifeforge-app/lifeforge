import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'

function Header({
  data,
  selectedNOTAMData
}: {
  data: any
  selectedNOTAMData: any
}): React.ReactElement {
  return (
    <div className="flex-between flex w-full">
      <h1 className="flex items-center gap-2 text-2xl font-semibold">
        <Icon className="size-7" icon="tabler:file-text" />
        {data.header?.id ?? selectedNOTAMData.title[1]}
      </h1>
      <span
        className={clsx(
          'rounded-full px-3 py-1 text-sm font-semibold',
          {
            active: 'text-green-500 bg-green-500/20',
            expired: 'text-bg-500 bg-bg-500/20',
            scheduled: 'text-yellow-500 bg-yellow-500/20'
          }[
            selectedNOTAMData.status.toLowerCase() as
              | 'active'
              | 'expired'
              | 'scheduled'
          ] ?? 'bg-bg-500/20 text-bg-500'
        )}
      >
        {selectedNOTAMData.status}
      </span>
    </div>
  )
}

export default Header
