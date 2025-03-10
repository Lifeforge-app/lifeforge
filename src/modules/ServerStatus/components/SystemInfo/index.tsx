import { Icon } from '@iconify/react'
import React from 'react'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import { ISystemInfo } from '@interfaces/server_status_interfaces'
import { formatBytes } from '@utils/strings'
import SectionCard from './components/SectionCard'

function SystemInfo(): React.ReactElement {
  const [systemInfo] = useFetch<ISystemInfo>('server/info')

  return (
    <div className="mt-16 mb-8 flex w-full flex-col gap-6">
      <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
        <Icon className="text-3xl" icon="tabler:info-circle" />
        <span className="ml-2">System Information</span>
      </h1>
      <APIFallbackComponent data={systemInfo}>
        {systemInfo => (
          <>
            {Object.entries(systemInfo).map(([key, value]) => (
              <SectionCard
                key={key}
                title={key}
                value={typeof value === 'number' ? formatBytes(value) : value}
              />
            ))}
          </>
        )}
      </APIFallbackComponent>
    </div>
  )
}

export default SystemInfo
