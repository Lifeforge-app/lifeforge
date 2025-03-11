import { Icon } from '@iconify/react'
import { useAPIOnlineStatus } from '@providers/APIOnlineStatusProvider'
import clsx from 'clsx'
import React from 'react'

function APIEnvironment(): React.ReactElement {
  const { environment } = useAPIOnlineStatus()

  return (
    <div className="mt-16 flex w-full items-center justify-between gap-6">
      <h1 className="flex items-center gap-2 text-2xl font-semibold">
        <Icon className="text-3xl" icon="tabler:plug-connected" />
        <span className="ml-2">API Environment</span>
      </h1>
      <span
        className={clsx(
          'flex items-center gap-2 rounded-full px-4 py-2 text-lg font-medium uppercase tracking-widest',
          environment === 'production' && 'bg-green-500/20 text-green-500',
          environment === 'development' && 'bg-yellow-500/20 text-yellow-500',
          !['production', 'development'].includes(environment ?? '') &&
            'bg-red-500/20 text-red-500'
        )}
      >
        <Icon
          className="text-2xl"
          icon={
            {
              production: 'tabler:briefcase',
              development: 'tabler:traffic-cone'
            }[environment!]
          }
        />
        {environment}
      </span>
    </div>
  )
}

export default APIEnvironment
