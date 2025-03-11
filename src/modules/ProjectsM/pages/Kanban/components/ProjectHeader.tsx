import { Icon } from '@iconify/react'
import { useProjectsMContext } from '@providers/ProjectsMProvider'
import clsx from 'clsx'
import React from 'react'
import { useNavigate } from 'react-router'

import { APIFallbackComponent, GoBackButton } from '@lifeforge/ui'

import { type IProjectsMEntry } from '@interfaces/projects_m_interfaces'

function ProjectHeader({
  projectData
}: {
  projectData: IProjectsMEntry
}): React.ReactElement {
  const {
    statuses: { data: statuses }
  } = useProjectsMContext()
  const navigate = useNavigate()

  return (
    <div className="space-y-1 pr-12">
      <GoBackButton
        onClick={() => {
          navigate('/projects-m')
        }}
      />
      <div className="flex-between flex">
        <h1 className="dark:text-bg-50 flex items-center gap-4 text-3xl font-semibold">
          <div
            className="rounded-lg p-3"
            style={{
              backgroundColor: projectData.color + '20',
              color: projectData.color
            }}
          >
            <Icon className="text-3xl" icon="tabler:hammer" />
          </div>
          {projectData.name}
          <APIFallbackComponent data={statuses}>
            {statuses => (
              <div
                className="shadow-custom ml-2 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-widest"
                style={{
                  backgroundColor:
                    statuses.find(e => e.id === projectData.status)?.color +
                    '20',
                  color: statuses.find(e => e.id === projectData.status)?.color
                }}
              >
                <Icon
                  className="text-lg"
                  icon={
                    statuses.find(e => e.id === projectData.status)?.icon ?? ''
                  }
                />
                {statuses.find(e => e.id === projectData.status)?.name}
                <Icon className="ml-1" icon="tabler:chevron-down" />
              </div>
            )}
          </APIFallbackComponent>
        </h1>
        <div className="flex gap-2 rounded-lg p-2">
          {[
            'tabler:layout-columns',
            'tabler:layout-list',
            'tabler:arrow-autofit-content'
          ].map((icon, index) => (
            <button
              key={index}
              className={clsx(
                'rounded-md p-4',
                index === 0
                  ? 'bg-bg-300/50 dark:bg-bg-700/50 dark:text-bg-50'
                  : 'text-bg-500 hover:bg-bg-100 dark:hover:bg-bg-700/50'
              )}
            >
              <Icon className="text-2xl" icon={icon} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectHeader
