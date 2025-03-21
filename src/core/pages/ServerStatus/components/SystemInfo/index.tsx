import { Icon } from '@iconify/react'
import prettyBytes from 'pretty-bytes'

import { QueryWrapper } from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

import { ISystemInfo } from '../../interfaces/server_status_interfaces'
import SectionCard from './components/SectionCard'

function SystemInfo() {
  const systemInfoQuery = useAPIQuery<ISystemInfo>('server/info', [
    'server',
    'info'
  ])

  return (
    <div className="mt-16 mb-8 flex w-full flex-col gap-6">
      <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
        <Icon className="text-3xl" icon="tabler:info-circle" />
        <span className="ml-2">System Information</span>
      </h1>
      <QueryWrapper query={systemInfoQuery}>
        {systemInfo => (
          <>
            {Object.entries(systemInfo).map(([key, value]) => (
              <SectionCard
                key={key}
                title={key}
                value={typeof value === 'number' ? prettyBytes(value) : value}
              />
            ))}
          </>
        )}
      </QueryWrapper>
    </div>
  )
}

export default SystemInfo
