/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { type IProjectsKEntry } from '@interfaces/projects_k_interfaces'
import CreateProjectModal from './components/CreateProjectModal'
import Header from './components/Header'
import ProjectList from './components/ProjectList'
import Sidebar from './components/Sidebar'

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

function ProjectsKList(): React.ReactElement {
  const [searchParams] = useSearchParams()
  const [projectList, refreshProjectList] = useFetch<IProjectsKEntry[]>(
    'projects-k/entries/list'
  )
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false)
  const [filteredProjectList, setFilteredProjectList] = useState<
    IProjectsKEntry[] | 'loading' | 'error'
  >(projectList)
  const [searchQuery, setSearchQuery] = useState('')

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
          title="Projects (K)"
          desc="It's time to stop procrastinating."
        />
        <div className="mb-8 mt-6 flex min-h-0 w-full flex-1">
          <Sidebar projectList={projectList} />
          <div className="ml-8 flex h-full flex-1 flex-col">
            <Header
              filteredProjectList={filteredProjectList}
              setCreateProjectModalOpen={setCreateProjectModalOpen}
            />
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stuffToSearch="projects"
            />
            <APIComponentWithFallback data={filteredProjectList}>
              {filteredProjectList => (
                <div className="mt-6 flex flex-1 flex-col gap-6 overflow-y-auto">
                  {filteredProjectList.length ? (
                    <ProjectList filteredProjectList={filteredProjectList} />
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

export default ProjectsKList
