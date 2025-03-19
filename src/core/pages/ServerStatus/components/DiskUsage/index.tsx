import { Icon } from '@iconify/react'

import { QueryWrapper } from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

import { IDiskUsage } from '../../interfaces/server_status_interfaces'
import DiskUsageCard from './components/DiskUsageCard'

function DiskUsage() {
  const diskUsageQuery = useAPIQuery<IDiskUsage[]>('server/disks', [
    'server',
    'disks'
  ])

  return (
    <div className="mt-16 flex w-full flex-col gap-6">
      <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
        <Icon className="text-3xl" icon="tabler:chart-pie" />
        <span className="ml-2">Disks Usage</span>
      </h1>
      <QueryWrapper query={diskUsageQuery}>
        {diskUsage => (
          <div className="grid gap-6 lg:grid-cols-2">
            {diskUsage.map(disk => (
              <DiskUsageCard key={disk.name} disk={disk} />
            ))}
          </div>
        )}
      </QueryWrapper>
    </div>
  )
}

export default DiskUsage
