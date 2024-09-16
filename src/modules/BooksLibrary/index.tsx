import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import Sidebar from './components/Sidebar'
import GridView from './views/GridView'
import ListView from './views/ListView'

function BooksLibrary(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('')
  const [books] = useFetch<any>('books-library/list')
  const [view, setView] = useState<'list' | 'grid'>('list')

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Books Library"
        icon="tabler:books"
        desc="A collection of reference books that accompany you on your learning journey."
      />
      <div className="mt-6 flex min-h-0 w-full min-w-0 flex-1">
        <Sidebar />
        <div className="flex h-full min-h-0 flex-1 flex-col pb-8 xl:ml-8">
          <div className="flex-between flex">
            <h1 className="text-3xl font-semibold sm:text-4xl">
              All Books <span className="text-base text-bg-500">(10)</span>
            </h1>
            <Button
              onClick={() => {}}
              icon="tabler:plus"
              className="hidden sm:flex"
            >
              upload
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stuffToSearch="books"
            />
            <div className="mt-4 flex items-center gap-2 rounded-md bg-bg-50 p-2 shadow-custom dark:bg-bg-900">
              {['grid', 'list'].map(viewType => (
                <button
                  key={viewType}
                  onClick={() => {
                    setView(viewType as 'grid' | 'list')
                  }}
                  className={`flex items-center gap-2 rounded-md p-2 transition-all ${
                    viewType === view
                      ? 'bg-bg-200/50 dark:bg-bg-800'
                      : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-100'
                  }`}
                >
                  <Icon
                    icon={
                      viewType === 'grid'
                        ? 'uil:apps'
                        : viewType === 'list'
                        ? 'uil:list-ul'
                        : ''
                    }
                    className="size-6"
                  />
                </button>
              ))}
            </div>
          </div>
          <APIComponentWithFallback data={books}>
            {books =>
              view === 'grid' ? (
                <GridView books={books} />
              ) : (
                <ListView books={books} />
              )
            }
          </APIComponentWithFallback>
        </div>
      </div>
    </ModuleWrapper>
  )
}

export default BooksLibrary
