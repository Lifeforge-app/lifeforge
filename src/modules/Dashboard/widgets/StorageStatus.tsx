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
            <div className="-mt-4 flex max-h-96 flex-col divide-y divide-bg-200 dark:divide-bg-700">
              {diskUsage.map(disk => (
                <div key={disk.name} className="space-y-4 py-6">
                  <div className="flex-between flex w-full min-w-0">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <Icon
                        className="text-xl text-bg-500"
                        icon="streamline:hard-disk"
                      />
                      <h2 className="mr-4 min-w-0 truncate text-bg-500">
                        {disk.name}
                      </h2>
                    </div>
                    <p className="shrink-0 rounded-md border border-bg-200 px-4 py-2 text-sm text-bg-500 dark:border-bg-500">
                      {disk.size}B
                    </p>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-bg-200 dark:bg-bg-800">
                    <div
                      className="h-full rounded-full bg-custom-500"
                      style={{ width: disk.usedPercent }}
                    ></div>
                  </div>
                  <div className="flex-between -mt-2 flex">
                    <p className="text-sm text-bg-500">
                      {disk.used}B / {disk.size}B
                    </p>
                    <p className="text-sm text-bg-500">
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
