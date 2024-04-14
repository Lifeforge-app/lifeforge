/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import React, { useEffect, useState } from 'react'
import ModuleHeader from '@components/ModuleHeader'
import ModuleWrapper from '@components/ModuleWrapper'
import useFetch from '@hooks/useFetch'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import { useSearchParams } from 'react-router-dom'
import { type IProjectsKProgress } from '../ProjectEntry/sections/ProjectProgress'
import CreateProjectModal from './components/CreateProjectModal'
import EmptyStateScreen from '@components/EmptyStateScreen'
import Sidebar from '@sidebar'
import ProjectList from './components/ProjectList'
import Header from './components/Header'
import SearchInput from '@components/SearchInput'

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

function ProjectsKList(): React.ReactElement {
  const [searchParams] = useSearchParams()
  const [projectList, refreshProjectList] = useFetch<IProjectsKEntry[]>(
    'projects-k/entry/list'
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
          title="Projects"
          desc="It's time to stop procrastinating."
        />
        <div className="mb-12 mt-6 flex min-h-0 w-full flex-1">
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
              {typeof filteredProjectList !== 'string' && (
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
