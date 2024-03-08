/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
import React, { Fragment, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import GoBackButton from '../../../../components/general/GoBackButton'
import { PROJECT_STATUS, type IProjectsKEntry } from '../ProjectList'
import useFetch from '../../../../hooks/useFetch'
import ProjectProgress from './sections/ProjectProgress'
import ProjectFiles from './sections/ProjectFiles'
import { Listbox, Transition } from '@headlessui/react'
import { toast } from 'react-toastify'
import { cookieParse } from 'pocketbase'
import APIComponentWithFallback from '../../../../components/general/APIComponentWithFallback'

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

function ProjectsKEntry(): React.JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const [valid] = useFetch<boolean>(`projects-k/entry/valid/${id}`)
  const [projectData, refreshProjectData] = useFetch<IProjectsKEntry>(
    `projects-k/entry/get/${id}`,
    id !== undefined
  )

  useEffect(() => {
    if (typeof valid === 'boolean' && !valid) {
      navigate('/projects-k')
    }
  }, [valid])

  async function updateProjectStatus(status: string): Promise<void> {
    fetch(
      `${import.meta.env.VITE_API_HOST}/projects-k/entry/update-status/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        },
        body: JSON.stringify({ status })
      }
    )
      .then(async res => {
        try {
          const data = await res.json()
          if (!res.ok || data.state !== 'success') {
            throw new Error(data.message)
          }
          toast.success('Project status updated successfully.')
        } catch (err) {
          throw new Error('Failed to update project status.')
        }
      })
      .catch(() => {
        toast.error('Failed to update project status.')
      })
      .finally(() => {
        refreshProjectData()
      })
  }

  useEffect(() => {
    if (!location.hash) {
      navigate('#progress')
    }
  }, [location.hash])

  return (
    <APIComponentWithFallback data={valid}>
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
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-bg-800">
                          {projectData.thumbnail ? (
                            <img
                              src={`${
                                import.meta.env.VITE_POCKETBASE_ENDPOINT
                              }/api/files/${projectData.collectionId}/${
                                projectData.id
                              }/${projectData.thumbnail}?thumb=50x50`}
                              className="h-full w-full"
                            />
                          ) : (
                            <Icon
                              icon="tabler:brush"
                              className="h-7 w-7 text-bg-500"
                            />
                          )}
                        </div>
                        {projectData.name}
                        <Listbox
                          onChange={status => {
                            updateProjectStatus(status).catch(() => {})
                          }}
                          value={projectData.status}
                          as="div"
                          className="relative"
                        >
                          <Listbox.Button
                            className={`ml-2 flex items-center rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest ${
                              PROJECT_STATUS[projectData.status].bg_transparent
                            } ${
                              PROJECT_STATUS[projectData.status]
                                .text_transparent
                            } shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)]`}
                          >
                            {PROJECT_STATUS[projectData.status].name}
                            <Icon
                              icon="tabler:pencil"
                              className="ml-2 h-3.5 w-3.5"
                            />
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-in duration-100"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute top-[2rem] z-50 mt-1 max-h-56 w-48 divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-800 sm:text-sm">
                              {Object.entries(PROJECT_STATUS).map(
                                ([id, { name, color }]) => (
                                  <Listbox.Option
                                    key={id}
                                    className={({ active }) =>
                                      `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                                        active
                                          ? 'bg-bg-200/50 dark:bg-bg-700/50'
                                          : '!bg-transparent'
                                      }`
                                    }
                                    value={id}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <div>
                                          <span className="flex items-center gap-2">
                                            <span
                                              className={`mr-2 h-2 w-2 rounded-md text-center font-semibold ${color}`}
                                            ></span>
                                            {name}
                                          </span>
                                        </div>
                                        {selected && (
                                          <Icon
                                            icon="tabler:check"
                                            className="block text-lg text-bg-100"
                                          />
                                        )}
                                      </>
                                    )}
                                  </Listbox.Option>
                                )
                              )}
                            </Listbox.Options>
                          </Transition>
                        </Listbox>
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
        <div className="mt-6 flex w-full items-center pr-8 sm:pr-12">
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
            '#progress': <ProjectProgress projectData={projectData} />,
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
    </APIComponentWithFallback>
  )
}

export default ProjectsKEntry
