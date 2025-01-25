import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { useAPIOnlineStatus } from '@providers/APIOnlineStatusProvider'

function APIEnvironment(): React.ReactElement {
  const { environment } = useAPIOnlineStatus()

  return (
    <div className="mt-16 flex w-full items-center justify-between gap-6">
      <h1 className="flex items-center gap-2 text-2xl font-semibold">
        <Icon icon="tabler:plug-connected" className="text-3xl" />
        <span className="ml-2">API Environment</span>
      </h1>
      <span
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-lg font-medium uppercase tracking-widest ${(() => {
          switch (environment) {
            case 'production':
              return 'bg-green-500/20 text-green-500'
            case 'development':
              return 'bg-yellow-500/20 text-yellow-500'
            default:
              return 'bg-red-500/20 text-red-500'
          }
        })()}`}
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
  )
}

export default APIEnvironment
