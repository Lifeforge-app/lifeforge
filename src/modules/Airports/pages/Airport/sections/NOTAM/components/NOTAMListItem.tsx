import { Icon } from '@iconify/react'
import React from 'react'

function NOTAMListItem({
  data,
  setSelectedNOTAMData,
  setViewDetailsModalOpen
}: {
  data: any
  setSelectedNOTAMData: React.Dispatch<React.SetStateAction<any>>
  setViewDetailsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  return (
    <button
      onClick={() => {
        setSelectedNOTAMData(data)
        setViewDetailsModalOpen(true)
      }}
      className="w-full space-y-4 rounded-lg bg-bg-50 p-4 text-left shadow-custom transition-all hover:bg-bg-100 dark:bg-bg-900 dark:hover:bg-bg-800/50"
    >
      <div className="flex-between flex">
        <h3 className="flex items-center gap-1 text-xl font-semibold">
          {data.title[0]}
          <Icon icon="tabler:chevron-right" className="size-5 text-bg-500" />
          {data.title[1]}
        </h3>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            {
              active: 'text-green-500 bg-green-500/20',
              expired: 'text-bg-500 bg-bg-500/20',
              scheduled: 'text-yellow-500 bg-yellow-500/20'
            }[
              data.status.toLowerCase() as 'active' | 'expired' | 'scheduled'
            ] ?? 'bg-bg-500/20 text-bg-500'
          }`}
        >
          {data.status}
        </span>
      </div>
      <div className="rounded-md bg-bg-200/50 p-4 text-bg-500 dark:bg-bg-800">
        <pre>
          <code>{data.codeSummary}</code>
        </pre>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Icon icon="tabler:location" className="size-5" />
          <p>{data.distance}</p>
        </div>
        <div className="flex items-center gap-1">
          <Icon icon="tabler:clock" className="size-5" />
          <p>{data.time}</p>
        </div>
        <div className="flex items-center gap-1">
          <Icon icon="tabler:calendar" className="size-5" />
          <p>{data.duration}</p>
        </div>
      </div>
    </button>
  )
}

export default NOTAMListItem
