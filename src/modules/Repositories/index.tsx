import { Icon } from '@iconify/react'
import moment from 'moment'
import React, { useState } from 'react'
import { Button } from '@components/buttons'
import { SearchInput } from '@components/inputs'
import ContentWrapperWithSidebar from '@components/layouts/module/ContentWrapperWithSidebar'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import SidebarAndContentWrapper from '@components/layouts/module/SidebarAndContentWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import LANGUAGE_COLORS from '@constants/language_colors'
import useFetch from '@hooks/useFetch'
import Sidebar from './Sidebar'

interface IRepositoriesRepo {
  archived: boolean
  created_at: string
  default_branch: string
  description: string
  full_name: string
  id: number
  language: string
  name: string
  open_issues_count: number
  owner: string
  size: number
  updated_at: string
}

function Repositories(): React.ReactElement {
  const [repos] = useFetch<IRepositoriesRepo[]>('repositories/repo/list')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <ModuleWrapper>
      <ModuleHeader title="Repositories" />
      <SidebarAndContentWrapper>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <ContentWrapperWithSidebar>
          <div className="flex-between flex">
            <h1 className="text-3xl font-semibold  md:text-4xl">
              All Repositories{' '}
              {/* <span className="text-base text-bg-500">(10)</span> */}
            </h1>
            <div className="flex items-center gap-6">
              <Button onClick={() => {}} icon="tabler:plus">
                new repo
              </Button>
              <button
                onClick={() => {
                  setSidebarOpen(true)
                }}
                className="-ml-4 rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-50 lg:hidden"
              >
                <Icon icon="tabler:menu" className="text-2xl" />
              </button>
            </div>
          </div>
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stuffToSearch="tasks"
          />
          <APIFallbackComponent data={repos}>
            {repos => (
              <ul className="mt-4 flex flex-1 flex-col gap-4 overflow-y-auto pb-24 sm:pb-8">
                {repos.map((repo, index) => (
                  <li
                    key={index}
                    className="space-y-4 rounded-lg bg-bg-50 p-4 shadow-custom transition-all hover:shadow-[4px_4px_10px_0px_rgba(0,0,0,0.1)] dark:bg-bg-900"
                  >
                    <div className="flex-between flex gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-bg-800 dark:text-bg-50!">
                          {repo.name}
                        </h2>
                        <p className="mt-1 text-sm text-bg-500">
                          {repo.description}
                        </p>
                      </div>
                      {repo.language !== '' && (
                        <span
                          className="relative isolate mb-1 block w-min whitespace-nowrap rounded-full px-3 py-1 text-xs shadow-xs"
                          style={{
                            backgroundColor: `${
                              LANGUAGE_COLORS[
                                repo.language as keyof typeof LANGUAGE_COLORS
                              ].color
                            }50`,
                            color: LANGUAGE_COLORS[
                              repo.language as keyof typeof LANGUAGE_COLORS
                            ].color as string
                          }}
                        >
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-bg-500">
                      <div className="flex items-center gap-2">
                        <Icon icon="tabler:clock" className="size-5" />
                        {moment(repo.updated_at).format('MMM Do, YYYY')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="tabler:git-branch" className="size-5" />
                        {repo.default_branch}
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="octicon:issue-opened-16"
                          className="size-4"
                        />
                        {repo.open_issues_count}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </APIFallbackComponent>
        </ContentWrapperWithSidebar>
      </SidebarAndContentWrapper>
    </ModuleWrapper>
  )
}

export default Repositories
