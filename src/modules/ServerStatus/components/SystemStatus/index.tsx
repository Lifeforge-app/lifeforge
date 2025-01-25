import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React, { useEffect } from 'react'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import {
  IMemoryUsage,
  ICPUUSage,
  ICPUTemp
} from '@interfaces/server_status_interfaces'
import { formatBytes } from '@utils/strings'
import { SystemStatusCard } from './components/SystemStatusCard'

function SystemStatus(): React.ReactElement {
  const [memoryUsage, refreshMemoryUsage] = useFetch<IMemoryUsage>(
    'server/memory',
    true,
    'GET',
    undefined,
    false,
    false
  )
  const [cpuUsage, refreshCPUUsage] = useFetch<ICPUUSage>(
    'server/cpu',
    true,
    'GET',
    undefined,
    false,
    false
  )
  const [cpuTemp, refreshCPUTemp] = useFetch<ICPUTemp>(
    'server/cpu-temp',
    true,
    'GET',
    undefined,
    false,
    false
  )

  useEffect(() => {
    const interval = setInterval(async () => {
      refreshMemoryUsage()
      refreshCPUUsage()
      refreshCPUTemp()
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [refreshMemoryUsage, refreshCPUUsage, refreshCPUTemp])

  return (
    <div className="mt-16 flex w-full flex-col gap-6">
      <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="tabler:device-desktop-analytics" className="text-3xl" />
        <span className="ml-2">System Status</span>
      </h1>
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            data: cpuUsage,
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
            data: memoryUsage,
            icon: 'gg:smartphone-ram',
            title: 'Memory Usage',
            valueKey: 'percent',
            unit: '%',
            description: (data: IMemoryUsage) =>
              `${formatBytes(data.used)} / ${formatBytes(data.total)} used`
          },
          {
            data: cpuTemp,
            icon: 'tabler:thermometer',
            title: 'CPU Temperature',
            valueKey: 'main',
            unit: '°C',
            description: (data: ICPUTemp) => `${data.max}°C max`
          }
        ].map(({ data, icon, title, valueKey, unit, description }, index) => (
          <APIFallbackComponent key={index} data={data}>
            {data => (
              <SystemStatusCard
                icon={icon}
                title={title}
                value={data[valueKey as keyof typeof data]}
                unit={unit}
                colorThresholds={{ high: 80, medium: 60 }}
                description={description(data as any)}
              />
            )}
          </APIFallbackComponent>
        ))}
      </div>
    </div>
  )
}

export default SystemStatus
