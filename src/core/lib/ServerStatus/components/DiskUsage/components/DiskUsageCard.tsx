import { Icon } from '@iconify/react'
import clsx from 'clsx'

import useComponentBg from '@hooks/useComponentBg'

import { IDiskUsage } from '../../../interfaces/server_status_interfaces'

function DiskUsageCard({ disk }: { disk: IDiskUsage }) {
  const { componentBg, componentBgLighter } = useComponentBg()

  return (
    <div
      key={disk.name}
      className={clsx('shadow-custom space-y-4 rounded-lg p-6', componentBg)}
    >
      <div className="flex-between flex w-full min-w-0">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Icon className="text-bg-500 text-2xl" icon="streamline:hard-disk" />
          <h2 className="text-bg-500 mr-8 min-w-0 truncate text-xl">
            {disk.name}
          </h2>
        </div>
        <p className="border-bg-400 text-bg-500 shrink-0 rounded-md border px-4 py-2 text-lg">
          {disk.size}B
        </p>
      </div>
      <div className="flex-between flex">
        <p className="text-bg-500 text-lg">Used</p>
        <p className="text-bg-500 text-lg">{disk.used}B</p>
      </div>
      <div className="flex-between flex">
        <p className="text-bg-500 text-lg">Available</p>
        <p className="text-bg-500 text-lg">{disk.avail}B</p>
      </div>
      <div
        className={clsx(
          'mt-4 h-3 w-full overflow-hidden rounded-full',
          componentBgLighter
        )}
      >
        <div
          className="h-full rounded-full bg-green-500"
          style={{ width: disk.usedPercent }}
        ></div>
      </div>
    </div>
  )
}

export default DiskUsageCard
