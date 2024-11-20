/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable operator-linebreak */

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Icon } from '@iconify/react'
import moment from 'moment'
import React, { useEffect } from 'react'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import {
  type ICPUTemp,
  type ICPUUSage,
  type IDiskUsage,
  type IMemoryUsage,
  type ISystemInfo
} from '@interfaces/server_status_interfaces'
import { useAPIOnlineStatus } from '@providers/APIOnlineStatusProvider'

function formatBytes(bytes: number, decimals = 2): string {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function camelCaseToTitleCase(text: string): string {
  return text.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

function ServerStatus(): React.ReactElement {
  const { environment } = useAPIOnlineStatus()

  const [diskUsage] = useFetch<IDiskUsage[]>('server/disks')
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
  const [systemInfo] = useFetch<ISystemInfo>('server/info')
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
    <ModuleWrapper>
      <ModuleHeader icon="tabler:server" title="Server Status" />
      <div className="mt-16 flex w-full items-center justify-between gap-6">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="tabler:plug-connected" className="text-3xl" />
          <span className="ml-2">API Environment</span>
        </h1>
        <span
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-lg font-medium uppercase tracking-widest ${
            environment === 'production'
              ? 'bg-green-500/20 text-green-500'
              : environment === 'development'
              ? 'bg-yellow-500/20 text-yellow-500'
              : 'bg-red-500/20 text-red-500'
          }`}
        >
          <Icon
            icon={
              {
                production: 'tabler:briefcase',
                development: 'tabler:traffic-cone'
              }[environment!]
            }
            className="text-2xl"
          />
          {environment}
        </span>
      </div>
      <div className="mt-16 flex w-full flex-col gap-6">
        <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="tabler:device-desktop-analytics" className="text-3xl" />
          <span className="ml-2">System Status</span>
        </h1>
        <div className="grid gap-6 lg:grid-cols-3">
          <APIComponentWithFallback data={cpuUsage}>
            {cpuUsage => (
              <div className="space-y-4 rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900">
                <div className="flex-between flex">
                  <div className="flex items-center gap-2">
                    <Icon icon="tabler:cpu" className="text-2xl" />
                    <h2 className="text-xl text-bg-500">CPU Usage</h2>
                  </div>
                  <p className="shrink-0 rounded-md border border-bg-400 px-4 py-2 text-lg text-bg-500">
                    {cpuUsage.usage.toFixed(2)}%
                  </p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-bg-200 dark:bg-bg-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      cpuUsage.usage > 80
                        ? 'bg-red-500'
                        : cpuUsage.usage > 60
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${cpuUsage.usage}%` }}
                  ></div>
                </div>

                <p className="text-center text-lg text-bg-500">
                  {moment(cpuUsage.uptime * 1000).format(
                    'D [days], H [hrs], m [mins]'
                  )}{' '}
                  uptime
                </p>
              </div>
            )}
          </APIComponentWithFallback>
          <APIComponentWithFallback data={memoryUsage}>
            {memoryUsage => (
              <div className="space-y-4 rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900">
                <div className="flex-between flex">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="gg:smartphone-ram"
                      className="text-2xl text-bg-500"
                    />
                    <h2 className="text-xl text-bg-500">Memory Usage</h2>
                  </div>
                  <p className="shrink-0 rounded-md border border-bg-400 px-4 py-2 text-lg text-bg-500">
                    {memoryUsage.percent.toFixed(2)}%
                  </p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-bg-200 dark:bg-bg-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      memoryUsage.percent > 80
                        ? 'bg-red-500'
                        : memoryUsage.percent > 60
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${memoryUsage.percent}%` }}
                  ></div>
                </div>
                <p className="text-center text-lg text-bg-500">
                  {formatBytes(memoryUsage.used)} /{' '}
                  {formatBytes(memoryUsage.total)} used
                </p>
              </div>
            )}
          </APIComponentWithFallback>
          <APIComponentWithFallback data={cpuTemp}>
            {cpuTemp => (
              <div className="space-y-4 rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900">
                <div className="flex-between flex">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="tabler:thermometer"
                      className="text-2xl text-bg-500"
                    />
                    <h2 className="text-xl text-bg-500">CPU Temperature</h2>
                  </div>
                  <p className="shrink-0 rounded-md border border-bg-400 px-4 py-2 text-lg text-bg-500">
                    {cpuTemp.main.toFixed(2)}°C
                  </p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-bg-200 dark:bg-bg-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      cpuTemp.main > 80
                        ? 'bg-red-500'
                        : cpuTemp.main > 60
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${cpuTemp.main}%` }}
                  ></div>
                </div>
                <p className="text-center text-lg text-bg-500">
                  {cpuTemp.max}°C max
                </p>
              </div>
            )}
          </APIComponentWithFallback>
        </div>
      </div>
      <div className="mt-16 flex w-full flex-col gap-6">
        <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="tabler:chart-pie" className="text-3xl" />
          <span className="ml-2">Disks Usage</span>
        </h1>
        <APIComponentWithFallback data={diskUsage}>
          {diskUsage => (
            <div className="grid gap-6 lg:grid-cols-2">
              {diskUsage.map(disk => (
                <div
                  key={disk.name}
                  className="space-y-4 rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900"
                >
                  <div className="flex-between flex w-full min-w-0">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <Icon
                        icon="streamline:hard-disk"
                        className="text-2xl text-bg-500"
                      />
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
                  <div className="mt-4 h-3 w-full overflow-hidden rounded-full border border-bg-200 dark:border-bg-500">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{ width: disk.usedPercent }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </APIComponentWithFallback>
      </div>
      <div className="mb-8 mt-16 flex w-full flex-col gap-6">
        <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="tabler:info-circle" className="text-3xl" />
          <span className="ml-2">System Information</span>
        </h1>
        <APIComponentWithFallback data={systemInfo}>
          {systemInfo => (
            <>
              {Object.entries(systemInfo).map(([key, value]) => (
                <div
                  key={key}
                  className="space-y-4 rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900"
                >
                  <h2 className="text-xl text-bg-500">
                    {key === 'mem' ? 'Memory' : camelCaseToTitleCase(key)}
                  </h2>
                  {!Array.isArray(value) ? (
                    <ul className="flex flex-col divide-y divide-bg-200 dark:divide-bg-700">
                      {Object.entries(value).map(([k, v]) => (
                        <li key={k} className="flex justify-between p-4">
                          <span className="text-lg text-bg-500">
                            {camelCaseToTitleCase(k)}
                          </span>
                          <span className="w-1/2 break-all text-lg text-bg-500">
                            {typeof v === 'object' ? (
                              <ul className="flex flex-col divide-y divide-bg-200 dark:divide-bg-700">
                                {/* @ts-expect-error - uhh lazy to fix for now =) */}
                                {Object.entries(v).map(([k, v]) => (
                                  <li
                                    key={k}
                                    className="flex justify-between p-4"
                                  >
                                    <span className="text-lg text-bg-500">
                                      {camelCaseToTitleCase(k)}
                                    </span>
                                    <span className="text-lg text-bg-500">
                                      {/* @ts-expect-error - uhh lazy to fix for now =) */}
                                      {formatBytes(v) || 'N/A'}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : key === 'mem' ? (
                              // @ts-expect-error - uhh lazy to fix for now =)
                              formatBytes(v)
                            ) : (
                              String(v) || 'N/A'
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    value.map((v, i) => (
                      <ul
                        key={i}
                        className="flex flex-col divide-y divide-bg-200 dark:divide-bg-700"
                      >
                        {Object.entries(v).map(([k, v]) => (
                          <li key={k} className="flex justify-between p-4">
                            <span className="text-lg text-bg-500">
                              {camelCaseToTitleCase(k)}
                            </span>
                            <span className="w-1/2 break-all text-lg text-bg-500">
                              {k.includes('byte')
                                ? // @ts-expect-error - uhh lazy to fix for now =)
                                  formatBytes(v)
                                : String(v) || 'N/A'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ))
                  )}
                </div>
              ))}
            </>
          )}
        </APIComponentWithFallback>
      </div>
    </ModuleWrapper>
  )
}

export default ServerStatus
