import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import forgeAPI from '@utils/forgeAPI'
import {
  ContextMenu,
  ContextMenuGroup,
  ContextMenuItem,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  SearchInput,
  ViewModeSelector,
  WithQuery
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useState } from 'react'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import AnnasModal from './components/modals/AnnasModal'
import LibgenModal from './components/modals/LibgenModal'
import UploadFromDeviceModal from './components/modals/UploadFromDeviceModal'
import useFilter from './hooks/useFilter'
import GridView from './views/GridView'
import ListView from './views/ListView'

function BooksLibrary() {
  const open = useModalStore(state => state.open)

  const {
    collection,
    language,
    favourite,
    fileType,
    readStatus,
    searchQuery,
    setSearchQuery
  } = useFilter()

  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300)

  const [view, setView] = useState<'list' | 'grid'>('list')

  const dataQuery = useQuery(
    forgeAPI.booksLibrary.entries.list
      .input({
        collection: collection || undefined,
        language: language || undefined,
        favourite: (favourite.toString() as 'true' | 'false') || undefined,
        fileType: fileType || undefined,
        readStatus: readStatus || undefined,
        query: debouncedSearchQuery.trim() || undefined
      })
      .queryOptions()
  )

  return (
    <>
      <ModuleHeader
        contextMenuProps={{
          classNames: {
            wrapper: 'block md:hidden'
          },
          children: (
            <ContextMenuGroup icon="tabler:eye" label="View as">
              {['grid', 'list'].map(type => (
                <ContextMenuItem
                  key={type}
                  checked={view === type}
                  icon={type === 'grid' ? 'uil:apps' : 'uil:list-ul'}
                  label={type.charAt(0).toUpperCase() + type.slice(1)}
                  onClick={() => {
                    setView(type as 'grid' | 'list')
                  }}
                />
              ))}
            </ContextMenuGroup>
          )
        }}
      />
      <div className="flex min-h-0 w-full min-w-0 flex-1">
        <Sidebar />
        <div className="flex h-full min-h-0 flex-1 flex-col pb-8 xl:ml-8">
          <Header itemCount={dataQuery.data?.length || 0} />
          <div className="mt-4 flex items-center gap-2">
            <SearchInput
              namespace="apps.booksLibrary"
              searchTarget="book"
              setValue={setSearchQuery}
              value={searchQuery}
            />
            <ViewModeSelector
              className="hidden md:flex"
              options={[
                { value: 'list', icon: 'uil:list-ul' },
                { value: 'grid', icon: 'uil:apps' }
              ]}
              setViewMode={setView}
              viewMode={view}
            />
          </div>
          <WithQuery query={dataQuery}>
            {entries => (
              <>
                {(() => {
                  {
                    if (entries.length === 0) {
                      if (
                        debouncedSearchQuery.trim() ||
                        [collection, language, favourite, fileType].some(v => v)
                      ) {
                        return (
                          <EmptyStateScreen
                            icon="tabler:search-off"
                            name="result"
                            namespace="apps.booksLibrary"
                          />
                        )
                      }

                      return (
                        <EmptyStateScreen
                          icon="tabler:books-off"
                          name="book"
                          namespace="apps.booksLibrary"
                        />
                      )
                    }

                    const FinalComponent = view === 'grid' ? GridView : ListView

                    return (
                      <>
                        <FinalComponent books={entries} />
                      </>
                    )
                  }
                })()}
              </>
            )}
          </WithQuery>
        </div>
      </div>
      <ContextMenu
        buttonComponent={<FAB className="static!" />}
        classNames={{
          wrapper: 'fixed right-6 bottom-6 z-50',
          menu: 'w-72'
        }}
      >
        <ContextMenuItem
          icon="tabler:upload"
          label="Upload from device"
          namespace="apps.booksLibrary"
          onClick={() => {
            open(UploadFromDeviceModal, {})
          }}
        />
        <ContextMenuItem
          icon="tabler:books"
          label="Download from Libgen"
          namespace="apps.booksLibrary"
          onClick={() => {
            open(LibgenModal, {})
          }}
        />
        <ContextMenuItem
          icon="tabler:archive"
          label="Search Annas"
          namespace="apps.booksLibrary"
          onClick={() => {
            open(AnnasModal, {})
          }}
        />
      </ContextMenu>
    </>
  )
}

export default BooksLibrary
