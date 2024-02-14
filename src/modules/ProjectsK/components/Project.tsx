import React, { useEffect } from 'react'
import { Icon } from '@iconify/react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import GoBackButton from '../../../components/general/GoBackButton'
import { PROJECT_STATUS, type IProjectsKEntry } from '..'
import useFetch from '../../../hooks/useFetch'
import ProjectProgress from './ProjectProgress'
import ProjectFiles from './ProjectFiles'

export interface IProjectsKVersion {
  collectionId: string
  collectionName: string
  created: string
  files: string[]
  id: string
  project_id: string
  thumbnail: string
  updated: string
}

function Project(): React.JSX.Element {
  const navigate = useNavigate()
  const { id } = useParams()
  const [projectData, refreshProjectData] = useFetch<IProjectsKEntry>(
    `projects-k/entry/get/${id}`
  )
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) {
      navigate('#progress')
    }
  }, [location.hash])

  return (
    <section className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto pl-12">
      <div className="flex flex-col gap-1 pr-12">
        <GoBackButton
          onClick={() => {
            navigate('/projects-k')
          }}
        />
        <div className="flex items-center justify-between">
          <h1
            className={`flex items-center gap-4 ${
              typeof projectData !== 'string'
                ? 'text-2xl sm:text-3xl'
                : 'text-2xl'
            } font-semibold `}
          >
            {(() => {
              switch (projectData) {
                case 'loading':
                  return (
                    <>
                      <span className="small-loader-light"></span>
                      Loading...
                    </>
                  )
                case 'error':
                  return (
                    <>
                      <Icon
                        icon="tabler:alert-triangle"
                        className="mt-0.5 h-7 w-7 text-red-500"
                      />
                      Failed to fetch data from server.
                    </>
                  )
                default:
                  return (
                    <>
                      <div className="overflow-hidden rounded-md">
                        <img
                          src={`${
                            import.meta.env.VITE_POCKETBASE_ENDPOINT
                          }/api/files/${projectData.collectionId}/${
                            projectData.id
                          }/${projectData.thumbnail}?thumb=50x50`}
                        />
                      </div>
                      {projectData.name}
                      <button
                        className={`ml-2 flex items-center rounded-full bg-yellow-500/20 px-4 py-1.5 text-xs font-medium uppercase tracking-widest ${
                          PROJECT_STATUS[projectData.status].bg
                        } ${
                          PROJECT_STATUS[projectData.status].text
                        } shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)]`}
                      >
                        {PROJECT_STATUS[projectData.status].name}
                        <Icon
                          icon="tabler:pencil"
                          className="ml-2 h-3.5 w-3.5"
                        />
                      </button>
                    </>
                  )
              }
            })()}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <button className="rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-100">
              <Icon icon="tabler:bulb" className="text-2xl" />
            </button>
            <button className="rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-100">
              <Icon icon="tabler:share" className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 flex w-full items-center pr-8 sm:pr-12">
        {[
          ['Progress', 'tabler:chart-bar', 'progress'],
          ['Files', 'tabler:files', 'files'],
          ['Payments', 'tabler:credit-card', 'payments']
        ].map(([name, icon, id]) => (
          <button
            key={id}
            onClick={() => {
              navigate(`#${id}`)
            }}
            className={`flex w-full items-center justify-center gap-2 p-6 text-bg-500 transition-all hover:text-bg-800 dark:hover:text-bg-100 ${
              location.hash === `#${id}`
                ? 'border-b-2 border-bg-100 !text-bg-100'
                : ''
            }`}
          >
            <Icon icon={icon} className="text-2xl" />
            {name}
          </button>
        ))}
      </div>
      {
        {
          '#progress': (
            <ProjectProgress
              projectData={projectData}
              refreshProjectData={refreshProjectData}
            />
          ),
          '#files': (
            <ProjectFiles
              projectData={projectData}
              refreshProjectData={refreshProjectData}
            />
          ),
          '#payments': 'Payments'
        }[location.hash]
      }
    </section>
  )
}

export default Project
