import React from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '@components/ButtonsAndInputs/Button'
import { type IProjectsKEntry } from '@interfaces/projects_k_interfaces'
import { PROJECT_STATUS } from '..'

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
      <h1 className="text-4xl font-semibold ">
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
      <Button
        onClick={() => {
          setCreateProjectModalOpen(true)
        }}
        icon="tabler:plus"
      >
        create
      </Button>
    </header>
  )
}

export default Header
