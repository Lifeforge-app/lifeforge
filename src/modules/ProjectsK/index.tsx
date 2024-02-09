/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'
import SidebarTitle from '../../components/Sidebar/components/SidebarTitle'
import SidebarDivider from '../../components/Sidebar/components/SidebarDivider'
import { Icon } from '@iconify/react'
import SidebarItem from '../../components/Sidebar/components/SidebarItem'
import ModuleWrapper from '../../components/general/ModuleWrapper'
import useFetch from '../../hooks/useFetch'
import APIComponentWithFallback from '../../components/general/APIComponentWithFallback'
import moment from 'moment'
import HamburgerMenu from '../../components/general/HamburgerMenu'
import { Link } from 'react-router-dom'

export interface IProjectsKEntry {
  collectionId: string
  collectionName: string
  created: string
  customer_name: string
  id: string
  is_released: boolean
  name: string
  payment_status: string
  status: 'scheduled' | 'wip' | 'completed'
  thumbnail: string
  type: 'personal' | 'commercial'
  updated: string
}

export const PROJECT_STATUS = {
  scheduled: {
    name: 'Scheduled',
    color: 'bg-red-500',
    text: 'text-red-500',
    bg: 'bg-red-500/20',
    icon: 'tabler:zzz'
  },
  wip: {
    name: 'Work In Progress',
    color: 'bg-yellow-500',
    text: 'text-yellow-500',
    bg: 'bg-yellow-500/20',
    icon: 'tabler:pencil'
  },
  completed: {
    name: 'Completed',
    color: 'bg-green-500',
    text: 'text-green-500',
    bg: 'bg-green-500/20',
    icon: 'tabler:circle-check'
  }
}

function ProjectsK(): React.JSX.Element {
  const [projectList] = useFetch<IProjectsKEntry[]>('projects-k/entry/list')

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Projects"
        desc="It's time to stop procrastinating."
      />
      <div className="mb-12 mt-8 flex min-h-0 w-full flex-1">
        <aside className="h-full w-1/4 overflow-hidden overflow-y-scroll rounded-lg bg-bg-50 py-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
          <ul className="flex flex-col overflow-y-hidden hover:overflow-y-scroll">
            <SidebarItem icon="tabler:list" name="All Projects" />
            <SidebarDivider />
            <SidebarTitle name="status" />
            {Object.values(PROJECT_STATUS).map(
              ({ icon, name, color }, index) => (
                <li
                  key={index}
                  className="relative flex items-center gap-6 px-4 font-medium text-bg-400 transition-all"
                >
                  <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800">
                    <span className={`block h-8 w-1.5 rounded-full ${color}`} />
                    <Icon icon={icon} className="h-6 w-6 shrink-0" />
                    <div className="flex w-full items-center justify-between">
                      {name}
                    </div>
                    <span className="text-sm">
                      {Math.floor(Math.random() * 10)}
                    </span>
                  </div>
                </li>
              )
            )}
            <SidebarDivider />
            <SidebarTitle name="visibility" />
            {[
              ['tabler:currency-dollar-off', 'Personal'],
              ['tabler:currency-dollar', 'Commercial']
            ].map(([icon, name], index) => (
              <li
                key={index}
                className="relative flex items-center gap-6 px-4 font-medium text-bg-400 transition-all"
              >
                <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800">
                  <Icon icon={icon} className="h-6 w-6 shrink-0" />
                  <div className="flex w-full items-center justify-between">
                    {name}
                  </div>
                  <span className="text-sm">
                    {Math.floor(Math.random() * 10)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </aside>
        <div className="ml-8 flex h-full flex-1 flex-col">
          <div className="mx-4 flex items-center justify-between">
            <h1 className="text-4xl font-semibold text-bg-800 dark:text-bg-100">
              All Projects <span className="text-base text-bg-400">(10)</span>
            </h1>
            <button className="flex shrink-0 items-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)]   hover:bg-custom-600 dark:text-bg-800">
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
                className="w-full bg-transparent text-bg-100 placeholder:text-bg-500 focus:outline-none"
              />
            </search>
          </div>
          <APIComponentWithFallback data={projectList}>
            {typeof projectList !== 'string' && (
              <div className="mt-6 flex flex-1 flex-col gap-6 overflow-y-auto">
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(33.333%,1fr))] px-4">
                  {projectList.map(project => (
                    <li
                      key={project.id}
                      className="relative flex h-min w-full flex-col gap-4 rounded-lg bg-bg-50 p-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900"
                    >
                      <div className="relative w-full overflow-hidden rounded-lg">
                        <div className="relative flex w-full justify-center">
                          <img
                            src={`${
                              import.meta.env.VITE_POCKETBASE_ENDPOINT
                            }/api/files/${project.collectionId}/${project.id}/${
                              project.thumbnail
                            }?thumb=0x500`}
                            className="h-auto w-full rounded-md object-cover"
                          />
                          <div
                            className={`absolute right-2 top-2 flex w-min items-center gap-2 whitespace-nowrap rounded-full px-2 py-1 pt-[6px] text-xs font-medium uppercase tracking-wider shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] ${
                              PROJECT_STATUS[project.status].text
                            } ${PROJECT_STATUS[project.status].bg}`}
                          >
                            {PROJECT_STATUS[project.status].name}
                          </div>
                        </div>
                        <div className="mt-4 flex items-start justify-between ">
                          <div className="flex w-full flex-col">
                            <h3 className="text-xl font-semibold text-bg-800 dark:text-bg-100">
                              {project.name}
                            </h3>
                            <p className="text-sm text-bg-500">
                              {project.customer_name}
                            </p>
                          </div>
                          <div className="relative z-[9999]">
                            <HamburgerMenu />
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
                            Not Applicable
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
                            0 versions
                          </span>
                        </div>
                      </div>
                      <progress
                        value={20}
                        max={100}
                        className="mt-4 h-1 w-full rounded-lg bg-bg-200 dark:bg-bg-800"
                      />
                      <span className="-mt-2 text-xs text-bg-500">
                        20% completed
                      </span>
                      <Link
                        to={`/projects-k/${project.id}`}
                        className="absolute left-0 top-0 h-full w-full"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </APIComponentWithFallback>
        </div>
      </div>
    </ModuleWrapper>
  )
}

export default ProjectsK
