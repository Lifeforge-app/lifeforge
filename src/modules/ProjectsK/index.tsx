/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import React, { useEffect, useState } from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'
import SidebarTitle from '../../components/Sidebar/components/SidebarTitle'
import SidebarDivider from '../../components/Sidebar/components/SidebarDivider'
import { Icon } from '@iconify/react'
import SidebarItem from '../../components/Sidebar/components/SidebarItem'
import ModuleWrapper from '../../components/general/ModuleWrapper'
import useFetch from '../../hooks/useFetch'
import APIComponentWithFallback from '../../components/general/APIComponentWithFallback'
import moment from 'moment'
import { Link, useSearchParams } from 'react-router-dom'
import { type IProjectsKProgress } from './components/ProjectProgress'
import CreateProjectModal from './components/CreateProjectModal'
import EmptyStateScreen from '../../components/general/EmptyStateScreen'

export interface IProjectsKEntry {
  collectionId: string
  collectionName: string
  created: string
  customer_name: string
  id: string
  is_released: boolean
  name: string
  payment_status?: {
    total_amt: number
    deposit_amt: number
    fully_paid: boolean
    deposit_paid: boolean
    fully_paid_date: string
    deposit_paid_date: string
  }
  status: 'scheduled' | 'wip' | 'completed'
  thumbnail: string
  type: 'personal' | 'commercial'
  updated: string
  files: string[]
  last_file_replacement_time: string
  thumb_original_filename: string
  progress: IProjectsKProgress
}

export const PROJECT_STATUS = {
  scheduled: {
    name: 'Scheduled',
    color: 'bg-red-500',
    text: 'text-red-800',
    text_transparent: 'text-red-500',
    bg: 'bg-red-500',
    bg_transparent: 'bg-red-500/20',
    icon: 'tabler:zzz'
  },
  wip: {
    name: 'In Progress',
    color: 'bg-yellow-500',
    text: 'text-yellow-800',
    text_transparent: 'text-yellow-500',
    bg: 'bg-yellow-500',
    bg_transparent: 'bg-yellow-500/20',
    icon: 'tabler:pencil'
  },
  completed: {
    name: 'Completed',
    color: 'bg-green-500',
    text: 'text-green-800',
    text_transparent: 'text-green-500',
    bg: 'bg-green-500',
    bg_transparent: 'bg-green-500/20',
    icon: 'tabler:circle-check'
  }
}

function ProjectsK(): React.JSX.Element {
  const [projectList, refreshProjectList] = useFetch<IProjectsKEntry[]>(
    'projects-k/entry/list'
  )
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filteredProjectList, setFilteredProjectList] = useState<
    IProjectsKEntry[] | 'loading' | 'error'
  >(projectList)

  useEffect(() => {
    if (typeof projectList !== 'string') {
      setFilteredProjectList(
        projectList
          .filter(
            e =>
              e.status === searchParams.get('status') ||
              searchParams.get('status') === null
          )
          .filter(
            e =>
              e.type === searchParams.get('type') ||
              searchParams.get('type') === null
          )
      )
    }
  }, [projectList, searchParams])

  return (
    <>
      <ModuleWrapper>
        <ModuleHeader
          title="Projects"
          desc="It's time to stop procrastinating."
        />
        <div className="mb-12 mt-6 flex min-h-0 w-full flex-1">
          <aside className="h-full w-1/4 overflow-hidden overflow-y-scroll rounded-lg bg-bg-50 py-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
            <ul className="flex flex-col gap-1">
              <SidebarItem
                active={
                  !searchParams.get('status') && !searchParams.get('type')
                }
                icon="tabler:list"
                name="All Projects"
                onClick={() => {
                  setSearchParams({})
                }}
              />
              <SidebarDivider />
              <SidebarTitle name="status" />
              <APIComponentWithFallback data={projectList}>
                {typeof projectList !== 'string' &&
                  Object.entries(PROJECT_STATUS).map(
                    ([id, { icon, name, color }], index) => (
                      <li
                        key={index}
                        className="relative flex items-center gap-6 px-4 font-medium text-bg-400 transition-all"
                      >
                        <button
                          onClick={() => {
                            if (
                              searchParams.has('status') &&
                              searchParams.get('status') === id
                            ) {
                              searchParams.delete('status')
                              setSearchParams(searchParams)
                              return
                            }
                            setSearchParams({
                              ...Object.fromEntries(searchParams.entries()),
                              status: id
                            })
                          }}
                          className={`flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800 ${
                            searchParams.get('status') === id
                              ? 'bg-bg-200 dark:bg-bg-800'
                              : ''
                          }`}
                        >
                          <span
                            className={`block h-8 w-1.5 rounded-full ${color}`}
                          />
                          <Icon icon={icon} className="h-6 w-6 shrink-0" />
                          <div className="flex w-full items-center justify-between">
                            {name}
                          </div>
                          <span className="text-sm">
                            {
                              projectList.filter(
                                project => project.status === id
                              ).length
                            }
                          </span>
                        </button>
                      </li>
                    )
                  )}
              </APIComponentWithFallback>
              <SidebarDivider />
              <SidebarTitle name="project type" />
              <APIComponentWithFallback data={projectList}>
                {typeof projectList !== 'string' &&
                  [
                    ['tabler:currency-dollar-off', 'Personal'],
                    ['tabler:currency-dollar', 'Commercial']
                  ].map(([icon, name], index) => (
                    <li
                      key={index}
                      className="relative flex items-center gap-6 px-4 font-medium text-bg-400 transition-all"
                    >
                      <button
                        onClick={() => {
                          if (
                            searchParams.has('type') &&
                            searchParams.get('type') === name.toLowerCase()
                          ) {
                            searchParams.delete('type')
                            setSearchParams(searchParams)
                            return
                          }
                          setSearchParams({
                            ...Object.fromEntries(searchParams.entries()),
                            type: name.toLowerCase()
                          })
                        }}
                        className={`flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800 ${
                          searchParams.get('type') === name.toLowerCase()
                            ? 'bg-bg-200 dark:bg-bg-800'
                            : ''
                        }`}
                      >
                        <Icon icon={icon} className="h-6 w-6 shrink-0" />
                        <div className="flex w-full items-center justify-between">
                          {name}
                        </div>
                        <span className="text-sm">
                          {
                            projectList.filter(
                              project => project.type === name.toLowerCase()
                            ).length
                          }
                        </span>
                      </button>
                    </li>
                  ))}
              </APIComponentWithFallback>
            </ul>
          </aside>
          <div className="ml-8 flex h-full flex-1 flex-col">
            <div className="mx-4 flex items-center justify-between">
              <h1 className="text-4xl font-semibold text-bg-800 dark:text-bg-100">
                {Object.entries(PROJECT_STATUS).find(
                  ([id]) => id === searchParams.get('status')
                )?.[1].name ?? 'All'}{' '}
                {searchParams.get('type') === 'personal'
                  ? 'Personal'
                  : searchParams.get('type') === 'commercial'
                  ? 'Commercial'
                  : ''}{' '}
                Projects{' '}
                <span className="text-base text-bg-400">
                  ({filteredProjectList.length})
                </span>
              </h1>
              <button
                onClick={() => {
                  setCreateProjectModalOpen(true)
                }}
                className="flex shrink-0 items-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)]   hover:bg-custom-600 dark:text-bg-800"
              >
                <Icon icon="tabler:plus" className="h-5 w-5 shrink-0" />
                <span className="shrink-0">create</span>
              </button>
            </div>
            <div className="mx-4 mt-6 flex items-center gap-4">
              <search className="flex w-full items-center gap-4 rounded-lg bg-bg-50 p-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
                <Icon icon="tabler:search" className="h-5 w-5 text-bg-500" />
                <input
                  type="text"
                  placeholder="Search projects ..."
                  className="w-full bg-transparent placeholder:text-bg-500 focus:outline-none"
                />
              </search>
            </div>
            <APIComponentWithFallback data={filteredProjectList}>
              {typeof filteredProjectList !== 'string' && (
                <div className="mt-6 flex flex-1 flex-col gap-6 overflow-y-auto">
                  {filteredProjectList.length ? (
                    <ul className="grid grid-cols-[repeat(auto-fill,minmax(30%,1fr))] gap-4 px-4">
                      {filteredProjectList.map(project => (
                        <li
                          key={project.id}
                          className="relative flex h-min w-full flex-col gap-4 overflow-hidden rounded-lg bg-bg-50 p-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900"
                        >
                          <div className="relative w-full overflow-hidden rounded-lg">
                            <div className="relative flex aspect-square h-auto w-full items-center justify-center rounded-md bg-bg-800">
                              {project.thumbnail ? (
                                <img
                                  src={`${
                                    import.meta.env.VITE_POCKETBASE_ENDPOINT
                                  }/api/files/${project.collectionId}/${
                                    project.id
                                  }/${project.thumbnail}?thumb=0x500`}
                                  className="aspect-square h-auto w-full rounded-md bg-bg-800 object-contain"
                                />
                              ) : (
                                <Icon
                                  icon="tabler:brush"
                                  className="h-32 w-32 text-bg-700"
                                />
                              )}
                            </div>
                            <div className="mt-4 flex items-start justify-between ">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`h-10 w-1 shrink-0 rounded-full ${
                                    PROJECT_STATUS[project.status].bg
                                  }`}
                                />
                                <div className="flex w-full flex-col">
                                  <h3 className="text-xl font-semibold text-bg-800 dark:text-bg-100">
                                    {project.name}
                                  </h3>
                                  <p className="text-sm text-bg-500">
                                    {project.customer_name}
                                  </p>
                                </div>
                              </div>
                              <div className="relative z-[9999]">
                                {/* <HamburgerMenu /> */}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Icon
                                icon={
                                  project.type === 'personal'
                                    ? 'tabler:currency-dollar-off'
                                    : 'tabler:currency-dollar'
                                }
                                className="h-5 w-5 text-bg-500"
                              />
                              <span className="text-sm text-bg-500">
                                {project.type === 'personal'
                                  ? 'Personal'
                                  : 'Commercial'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon
                                icon="tabler:credit-card"
                                className="h-5 w-5 text-bg-500"
                              />
                              <span className="text-sm text-bg-500">
                                {project.payment_status
                                  ? project.payment_status.fully_paid
                                    ? 'Fully Paid'
                                    : project.payment_status.deposit_paid
                                    ? 'Deposit Paid'
                                    : 'Unpaid'
                                  : 'N/A'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Icon
                                icon="tabler:calendar-event"
                                className="h-5 w-5 text-bg-500"
                              />
                              <span className="text-sm text-bg-500">
                                {moment(project.created).format('DD MMM YYYY')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon
                                icon="tabler:versions"
                                className="h-5 w-5 text-bg-500"
                              />
                              <span className="text-sm text-bg-500">
                                {project.files.length} files
                              </span>
                            </div>
                          </div>
                          <progress
                            value={
                              project.progress.completed /
                              project.progress.steps.length
                            }
                            max={1}
                            className="mt-4 h-1 w-full rounded-lg bg-bg-200 dark:bg-bg-800"
                          />
                          <span className="-mt-2 text-xs text-bg-500">
                            {(project.progress.completed /
                              project.progress.steps.length) *
                              100}
                            % completed
                          </span>
                          <Link
                            to={`/projects-k/${project.id}`}
                            className="absolute left-0 top-0 h-full w-full transition-colors hover:bg-bg-100/[0.02]"
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyStateScreen
                      icon="tabler:file-off"
                      title="Seems a bit empty here"
                      description="Hmm... Nothing seems to be related with your filter."
                    />
                  )}
                </div>
              )}
            </APIComponentWithFallback>
          </div>
        </div>
      </ModuleWrapper>
      <CreateProjectModal
        isOpen={createProjectModalOpen}
        setOpen={setCreateProjectModalOpen}
        updateProjectsList={refreshProjectList}
      />
    </>
  )
}

export default ProjectsK
