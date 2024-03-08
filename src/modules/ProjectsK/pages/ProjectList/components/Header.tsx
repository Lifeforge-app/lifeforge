/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import { type IProjectsKEntry, PROJECT_STATUS } from '..'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useSearchParams } from 'react-router-dom'

function Header({
  filteredProjectList,
  setCreateProjectModalOpen
}: {
  filteredProjectList: IProjectsKEntry[] | 'loading' | 'error'
  setCreateProjectModalOpen: (value: boolean) => void
}): React.ReactElement {
  const [searchParams] = useSearchParams()

  return (
    <header className="mx-4 flex items-center justify-between">
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
        <span className="text-base text-bg-500">
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
    </header>
  )
}

export default Header
