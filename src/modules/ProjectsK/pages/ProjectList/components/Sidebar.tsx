/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Icon } from '@iconify/react'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import { type IProjectsKEntry } from '@typedec/ProjectK'
import { PROJECT_STATUS } from '..'

function Sidebar({
  projectList
}: {
  projectList: IProjectsKEntry[] | 'loading' | 'error'
}): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <aside className="h-full w-1/4 overflow-hidden overflow-y-scroll rounded-lg bg-bg-50 py-4 shadow-custom dark:bg-bg-900">
      <ul className="flex flex-col gap-1">
        <SidebarItem
          active={!searchParams.get('status') && !searchParams.get('type')}
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
                  className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
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
                    className={`flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-100 dark:hover:bg-bg-800 ${
                      searchParams.get('status') === id
                        ? 'bg-bg-200/50 text-bg-800 dark:bg-bg-800 dark:text-bg-100'
                        : ''
                    }`}
                  >
                    <span className={`block h-8 w-1.5 rounded-full ${color}`} />
                    <Icon icon={icon} className="size-6 shrink-0" />
                    <div className="flex w-full items-center justify-between">
                      {name}
                    </div>
                    <span className="text-sm">
                      {
                        projectList.filter(project => project.status === id)
                          .length
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
                className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
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
                  className={`flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-100 dark:hover:bg-bg-800 ${
                    searchParams.get('type') === name.toLowerCase()
                      ? 'bg-bg-200/50 text-bg-800 dark:bg-bg-800 dark:text-bg-100'
                      : ''
                  }`}
                >
                  <Icon icon={icon} className="size-6 shrink-0" />
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
  )
}

export default Sidebar
