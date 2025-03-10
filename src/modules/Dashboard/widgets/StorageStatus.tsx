import { Icon } from '@iconify/react'
import React from 'react'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import DashboardItem from '@components/utilities/DashboardItem'
import Scrollbar from '@components/utilities/Scrollbar'
import useFetch from '@hooks/useFetch'
import { type IDiskUsage } from '@interfaces/server_status_interfaces'

export default function StorageStatus(): React.ReactElement {
  const [diskUsage] = useFetch<IDiskUsage[]>('server/disks')

  return (
    <DashboardItem icon="tabler:server" title="Storage Status">
      <Scrollbar>
        <APIFallbackComponent data={diskUsage}>
          {diskUsage => (
            <div className="divide-bg-200 dark:divide-bg-700 -mt-4 flex max-h-96 flex-col divide-y">
              {diskUsage.map(disk => (
                <div key={disk.name} className="space-y-4 py-6">
                  <div className="flex-between flex w-full min-w-0">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <Icon
                        className="text-bg-500 text-xl"
                        icon="streamline:hard-disk"
                      />
                      <h2 className="text-bg-500 mr-4 min-w-0 truncate">
                        {disk.name}
                      </h2>
                    </div>
                    <p className="border-bg-200 text-bg-500 dark:border-bg-500 shrink-0 rounded-md border px-4 py-2 text-sm">
                      {disk.size}B
                    </p>
                  </div>
                  <div className="bg-bg-200 dark:bg-bg-800 mt-2 h-2 w-full overflow-hidden rounded-full">
                    <div
                      className="bg-custom-500 h-full rounded-full"
                      style={{ width: disk.usedPercent }}
                    ></div>
                  </div>
                  <div className="flex-between -mt-2 flex">
                    <p className="text-bg-500 text-sm">
                      {disk.used}B / {disk.size}B
                    </p>
                    <p className="text-bg-500 text-sm">
                      {disk.usedPercent} used
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </APIFallbackComponent>
      </Scrollbar>
    </DashboardItem>
  )
}
