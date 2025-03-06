import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import useThemeColors from '@hooks/useThemeColor'
import { IDiskUsage } from '@interfaces/server_status_interfaces'

function DiskUsageCard({ disk }: { disk: IDiskUsage }): React.ReactElement {
  const { componentBg, componentBgLighter } = useThemeColors()

  return (
    <div
      key={disk.name}
      className={clsx('space-y-4 rounded-lg p-6 shadow-custom', componentBg)}
    >
      <div className="flex-between flex w-full min-w-0">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Icon className="text-2xl text-bg-500" icon="streamline:hard-disk" />
          <h2 className="mr-8 min-w-0 truncate text-xl text-bg-500">
            {disk.name}
          </h2>
        </div>
        <p className="shrink-0 rounded-md border border-bg-400 px-4 py-2 text-lg text-bg-500">
          {disk.size}B
        </p>
      </div>
      <div className="flex-between flex">
        <p className="text-lg text-bg-500">Used</p>
        <p className="text-lg text-bg-500">{disk.used}B</p>
      </div>
      <div className="flex-between flex">
        <p className="text-lg text-bg-500">Available</p>
        <p className="text-lg text-bg-500">{disk.avail}B</p>
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
