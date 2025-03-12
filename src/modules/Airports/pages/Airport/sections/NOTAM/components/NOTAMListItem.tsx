import { Icon } from '@iconify/react'
import clsx from 'clsx'

function NOTAMListItem({
  data,
  setSelectedNOTAMData,
  setViewDetailsModalOpen
}: {
  data: any
  setSelectedNOTAMData: React.Dispatch<React.SetStateAction<any>>
  setViewDetailsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <button
      className="bg-bg-50 shadow-custom hover:bg-bg-100 dark:bg-bg-900 dark:hover:bg-bg-800/50 w-full space-y-4 rounded-lg p-4 text-left transition-all"
      onClick={() => {
        setSelectedNOTAMData(data)
        setViewDetailsModalOpen(true)
      }}
    >
      <div className="flex-between flex">
        <h3 className="flex items-center gap-1 text-xl font-semibold">
          {data.title[0]}
          <Icon className="text-bg-500 size-5" icon="tabler:chevron-right" />
          {data.title[1]}
        </h3>
        <span
          className={clsx(
            'rounded-full px-3 py-1 text-sm font-semibold',
            {
              'bg-green-500/20 text-green-500':
                data.status.toLowerCase() === 'active',
              'text-bg-500 bg-bg-500/20':
                data.status.toLowerCase() === 'expired',
              'bg-yellow-500/20 text-yellow-500':
                data.status.toLowerCase() === 'scheduled'
            },
            !['active', 'expired', 'scheduled'].includes(
              data.status.toLowerCase()
            ) && 'bg-bg-500/20 text-bg-500'
          )}
        >
          {data.status}
        </span>
      </div>
      <div className="bg-bg-200/50 text-bg-500 dark:bg-bg-800 rounded-md p-4">
        <pre>
          <code>{data.codeSummary}</code>
        </pre>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Icon className="size-5" icon="tabler:location" />
          <p>{data.distance}</p>
        </div>
        <div className="flex items-center gap-1">
          <Icon className="size-5" icon="tabler:clock" />
          <p>{data.time}</p>
        </div>
        <div className="flex items-center gap-1">
          <Icon className="size-5" icon="tabler:calendar" />
          <p>{data.duration}</p>
        </div>
      </div>
    </button>
  )
}

export default NOTAMListItem
