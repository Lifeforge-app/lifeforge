import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { useDebounce } from '@uidotdev/usehooks'
import {
  Button,
  EmptyStateScreen,
  HamburgerMenuSelectorWrapper,
  MenuItem,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper,
  SearchInput,
  ViewModeSelector
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import {
  BooksLibraryCollectionsSchemas,
  ISchemaWithPB
} from 'shared/types/collections'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import LibgenModal from './modals/LibgenModal'
import { useBooksLibraryContext } from './providers/BooksLibraryProvider'
import GridView from './views/GridView'
import ListView from './views/ListView'

function BooksLibrary() {
  const open = useModalStore(state => state.open)

  const [searchParams] = useSearchParams()

  const {
    entriesQuery,
    fileTypesQuery,
    miscellaneous: { searchQuery, setSearchQuery }
  } = useBooksLibraryContext()

  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300)

  const [filteredEntries, setFilteredEntries] = useState<
    ISchemaWithPB<BooksLibraryCollectionsSchemas.IEntry>[]
  >([])

  const [view, setView] = useState<'list' | 'grid'>('list')

  const handleOpenLibgenModal = useCallback(() => {
    open(LibgenModal, {})
  }, [])

  useEffect(() => {
    if (
      entriesQuery.isLoading ||
      fileTypesQuery.isLoading ||
      !entriesQuery.data ||
      !fileTypesQuery.data
    ) {
      return
    }

    const filteredEntries = entriesQuery.data.filter(
      entry =>
        entry.title
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) &&
        (searchParams.get('collection') !== null
          ? entry.collection === searchParams.get('collection')
          : true) &&
        (searchParams.get('language') !== null
          ? entry.languages.includes(searchParams.get('language') as string)
          : true) &&
        (searchParams.get('favourite') === 'true'
          ? entry.is_favourite
          : true) &&
        (searchParams.get('fileType') !== null
          ? entry.extension ===
            fileTypesQuery.data.find(
              fileType => fileType.id === searchParams.get('fileType')
            )?.name
          : true)
    )

    setFilteredEntries(filteredEntries)
  }, [
    entriesQuery.data,
    debouncedSearchQuery,
    searchParams,
    fileTypesQuery.data
  ])

  return (
    <ModuleWrapper>
      <ModuleHeader
        hamburgerMenuClassName="block md:hidden"
        hamburgerMenuItems={
          <HamburgerMenuSelectorWrapper icon="tabler:eye" title="View as">
            {['grid', 'list'].map(type => (
              <MenuItem
                key={type}
                icon={type === 'grid' ? 'uil:apps' : 'uil:list-ul'}
                isToggled={view === type}
                text={type.charAt(0).toUpperCase() + type.slice(1)}
                onClick={() => {
                  setView(type as 'grid' | 'list')
                }}
              />
            ))}
          </HamburgerMenuSelectorWrapper>
        }
        icon="tabler:books"
        title="Books Library"
      />
      <div className="flex min-h-0 w-full min-w-0 flex-1">
        <Sidebar />
        <div className="flex h-full min-h-0 flex-1 flex-col pb-8 xl:ml-8">
          <Header
            itemCount={
              typeof filteredEntries !== 'string' ? filteredEntries.length : 0
            }
          />
          <div className="flex items-center gap-2">
            <SearchInput
              className="mt-4"
              namespace="apps.booksLibrary"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stuffToSearch="book"
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
          <QueryWrapper query={entriesQuery}>
            {entries => {
              if (filteredEntries.length === 0) {
                if (entries.length === 0) {
                  return (
                    <EmptyStateScreen
                      icon="tabler:books-off"
                      name="book"
                      namespace="apps.booksLibrary"
                    />
                  )
                }

                return (
                  <EmptyStateScreen
                    icon="tabler:search-off"
                    name="result"
                    namespace="apps.booksLibrary"
                  />
                )
              }

              switch (view) {
                case 'grid':
                  return <GridView books={filteredEntries} />
                case 'list':
                  return <ListView books={filteredEntries} />
              }
            }}
          </QueryWrapper>
        </div>
      </div>
      <Menu as="div" className="fixed right-6 bottom-6 z-50 block md:hidden">
        <Button as={MenuButton} icon="tabler:plus" onClick={() => {}}></Button>
        <MenuItems
          transition
          anchor="top end"
          className="bg-bg-100 dark:bg-bg-800 overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out [--anchor-gap:6px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
        >
          <MenuItem
            icon="tabler:upload"
            namespace="apps.booksLibrary"
            text="Upload from device"
            onClick={() => {}}
          />
          <MenuItem
            icon="tabler:books"
            namespace="apps.booksLibrary"
            text="Download from Libgen"
            onClick={handleOpenLibgenModal}
          />
        </MenuItems>
      </Menu>
    </ModuleWrapper>
  )
}

export default BooksLibrary
