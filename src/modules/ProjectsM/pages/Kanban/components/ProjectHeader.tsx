import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { useNavigate, useParams } from 'react-router'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import {
  type IProjectsMStatus,
  type IProjectsMEntry
} from '@interfaces/projects_m_interfaces'

function ProjectHeader(): React.ReactElement {
  const { id } = useParams<{ id: string }>()
  const [statuses] = useFetch<IProjectsMStatus[]>('projects-m/status')
  const [projectData] = useFetch<IProjectsMEntry>(`projects-m/entry/${id}`)
  const navigate = useNavigate()

  return (
    <APIComponentWithFallback data={projectData}>
      {projectData => (
        <div className="flex flex-col gap-1 pr-12">
          <GoBackButton
            onClick={() => {
              navigate('/projects-m')
            }}
          />
          <div className="flex items-center justify-between">
            <h1 className="flex items-center gap-4 text-3xl font-semibold dark:text-bg-100">
              <div
                className="rounded-lg p-3"
                style={{
                  backgroundColor: projectData.color + '20',
                  color: projectData.color
                }}
              >
                <Icon icon="tabler:hammer" className="text-3xl" />
              </div>
              {projectData.name}
              <APIComponentWithFallback data={statuses}>
                {statuses => (
                  <div
                    className="ml-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest shadow-custom"
                    style={{
                      backgroundColor:
                        statuses.find(e => e.id === projectData.status)?.color +
                        '20',
                      color: statuses.find(e => e.id === projectData.status)
                        ?.color
                    }}
                  >
                    {statuses.find(e => e.id === projectData.status)?.name}
                  </div>
                )}
              </APIComponentWithFallback>
            </h1>
            <div className="flex gap-2 rounded-lg p-2">
              {[
                'tabler:layout-columns',
                'tabler:layout-list',
                'tabler:arrow-autofit-content'
              ].map((icon, index) => (
                <button
                  key={index}
                  className={`rounded-md p-4 ${
                    index === 0
                      ? 'bg-bg-300/50 dark:bg-bg-700/50 dark:text-bg-100'
                      : 'text-bg-500 hover:bg-bg-200/50 dark:hover:bg-bg-700/50'
                  }`}
                >
                  <Icon icon={icon} className="text-2xl" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </APIComponentWithFallback>
  )
}

export default ProjectHeader
