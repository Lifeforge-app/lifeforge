import { Icon } from '@iconify/react'
import moment from 'moment'
import React, { useState } from 'react'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import Button from '@components/Button'
import ModuleHeader from '@components/ModuleHeader'
import ModuleWrapper from '@components/ModuleWrapper'
import SearchInput from '@components/SearchInput'
import useFetch from '@hooks/useFetch'
import Sidebar from './Sidebar'
import LANGUAGE_COLORS from '../../constants/language_colors'

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
      <ModuleHeader title="Repositories" desc="" />
      <div className="mt-6 flex min-h-0 w-full flex-1">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex h-full flex-1 flex-col lg:ml-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-bg-800 dark:text-bg-100 md:text-4xl">
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
                className="-ml-4 rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-100 lg:hidden"
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
          <APIComponentWithFallback data={repos}>
            {typeof repos !== 'string' && (
              <ul className="mt-4 flex flex-1 flex-col gap-4 overflow-y-auto pb-24 sm:pb-8">
                {repos.map((repo, index) => (
                  <li
                    key={index}
                    className="flex flex-col gap-4 rounded-lg bg-bg-50 p-4 shadow-custom transition-all hover:shadow-[4px_4px_10px_0px_rgba(0,0,0,0.1)] dark:bg-bg-900"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-bg-800 dark:!text-bg-100">
                          {repo.name}
                        </h2>
                        <p className="mt-1 text-sm text-bg-500">
                          {repo.description}
                        </p>
                      </div>
                      {repo.language !== '' && (
                        <span
                          className="relative isolate mb-1 block w-min whitespace-nowrap rounded-full px-3 py-1 text-xs shadow-sm"
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
                        <Icon icon="tabler:clock" className="h-5 w-5" />
                        {moment(repo.updated_at).format('MMM Do, YYYY')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="tabler:git-branch" className="h-5 w-5" />
                        {repo.default_branch}
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="octicon:issue-opened-16"
                          className="h-4 w-4"
                        />
                        {repo.open_issues_count}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </APIComponentWithFallback>
        </div>
      </div>
    </ModuleWrapper>
  )
}

export default Repositories
