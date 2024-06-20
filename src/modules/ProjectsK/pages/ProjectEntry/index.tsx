/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Listbox } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import ListboxTransition from '@components/Listbox/ListboxTransition'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import { type IProjectsKEntry } from '@interfaces/project_k_interfaces'
import ProjectFiles from './sections/ProjectFiles'
import ProjectProgress from './sections/ProjectProgress'
import { PROJECT_STATUS } from '../ProjectList'

function ProjectsKEntry(): React.ReactElement {
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
                          className="mt-0.5 size-7 text-red-500"
                        />
                        Failed to fetch data from server.
                      </>
                    )
                  default:
                    return (
                      <>
                        <div className="flex-center flex size-12 overflow-hidden rounded-md bg-bg-800">
                          {projectData.thumbnail ? (
                            <img
                              src={`${import.meta.env.VITE_API_HOST}/media/${
                                projectData.collectionId
                              }/${projectData.id}/${
                                projectData.thumbnail
                              }?thumb=50x50`}
                              className="size-full"
                            />
                          ) : (
                            <Icon
                              icon="tabler:brush"
                              className="size-7 text-bg-500"
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
                            } shadow-custom`}
                          >
                            {PROJECT_STATUS[projectData.status].name}
                            <Icon
                              icon="tabler:pencil"
                              className="ml-2 size-3.5"
                            />
                          </Listbox.Button>
                          <ListboxTransition>
                            <Listbox.Options className="absolute top-8 z-50 mt-1 max-h-56 w-48 divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-800 sm:text-sm">
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
                                              className={`mr-2 size-2 rounded-md text-center font-semibold ${color}`}
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
                          </ListboxTransition>
                        </Listbox>
                      </>
                    )
                }
              })()}
            </h1>
            <div className="flex-center flex gap-2">
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
              className={`flex-center flex w-full gap-2 p-6 text-bg-500 transition-all hover:text-bg-800 dark:hover:text-bg-100 ${
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
