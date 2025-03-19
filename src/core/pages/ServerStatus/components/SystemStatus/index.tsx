import { Icon } from '@iconify/react'
import moment from 'moment'
import prettyBytes from 'pretty-bytes'
import { useEffect } from 'react'

import { QueryWrapper } from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

import {
  ICPUTemp,
  ICPUUSage,
  IMemoryUsage
} from '../../interfaces/server_status_interfaces'
import { SystemStatusCard } from './components/SystemStatusCard'

function SystemStatus() {
  const memoryUsageQuery = useAPIQuery<IMemoryUsage>('server/memory', [
    'server',
    'memory'
  ])
  const cpuUsageQuery = useAPIQuery<ICPUUSage>('server/cpu', ['server', 'cpu'])
  const cpuTempQuery = useAPIQuery<ICPUTemp>('server/cpu-temp', [
    'server',
    'cpu-temp'
  ])

  useEffect(() => {
    const interval = setInterval(async () => {
      memoryUsageQuery.refetch()
      cpuUsageQuery.refetch()
      cpuTempQuery.refetch()
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="mt-16 flex w-full flex-col gap-6">
      <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
        <Icon className="text-3xl" icon="tabler:device-desktop-analytics" />
        <span className="ml-2">System Status</span>
      </h1>
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            data: cpuUsageQuery,
            icon: 'tabler:cpu',
            title: 'CPU Usage',
            valueKey: 'usage',
            unit: '%',
            description: (data: ICPUUSage) =>
              `${moment(data.uptime * 1000).format(
                'D [days], H [hrs], m [mins]'
              )} uptime`
          },
          {
            data: memoryUsageQuery,
            icon: 'gg:smartphone-ram',
            title: 'Memory Usage',
            valueKey: 'percent',
            unit: '%',
            description: (data: IMemoryUsage) =>
              `${prettyBytes(+data.used)} / ${prettyBytes(+data.total)} used`
          },
          {
            data: cpuTempQuery,
            icon: 'tabler:thermometer',
            title: 'CPU Temperature',
            valueKey: 'main',
            unit: '°C',
            description: (data: ICPUTemp) => `${data.max}°C max`
          }
        ].map(({ data, icon, title, valueKey, unit, description }) => (
          <QueryWrapper key={title} query={data as any}>
            {(data: any) => (
              <SystemStatusCard
                colorThresholds={{ high: 80, medium: 60 }}
                description={description(data as any)}
                icon={icon}
                title={title}
                unit={unit}
                value={data[valueKey as keyof typeof data]}
              />
            )}
          </QueryWrapper>
        ))}
      </div>
    </div>
  )
}

export default SystemStatus
