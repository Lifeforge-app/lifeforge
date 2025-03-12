import { Icon } from '@iconify/react'

import { APIFallbackComponent } from '@lifeforge/ui'

import useFetch from '@hooks/useFetch'

import { IDiskUsage } from '../../interfaces/server_status_interfaces'
import DiskUsageCard from './components/DiskUsageCard'

function DiskUsage() {
  const [diskUsage] = useFetch<IDiskUsage[]>('server/disks')

  return (
    <div className="mt-16 flex w-full flex-col gap-6">
      <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
        <Icon className="text-3xl" icon="tabler:chart-pie" />
        <span className="ml-2">Disks Usage</span>
      </h1>
      <APIFallbackComponent data={diskUsage}>
        {diskUsage => (
          <div className="grid gap-6 lg:grid-cols-2">
            {diskUsage.map(disk => (
              <DiskUsageCard key={disk.name} disk={disk} />
            ))}
          </div>
        )}
      </APIFallbackComponent>
    </div>
  )
}

export default DiskUsage
