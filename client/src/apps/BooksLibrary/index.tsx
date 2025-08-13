import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { useDebounce } from '@uidotdev/usehooks'
import {
  Button,
  ContextMenuItem,
  ContextMenuSelectorWrapper,
  EmptyStateScreen,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper,
  SearchInput,
  ViewModeSelector
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useMemo, useState } from 'react'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import LibgenModal from './modals/LibgenModal'
import { useBooksLibraryContext } from './providers/BooksLibraryProvider'
import GridView from './views/GridView'
import ListView from './views/ListView'

function BooksLibrary() {
  const open = useModalStore(state => state.open)

  const {
    entriesQuery,
    fileTypesQuery,
    miscellaneous: { selected, searchQuery, setSearchQuery }
  } = useBooksLibraryContext()

  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300)

  const [view, setView] = useState<'list' | 'grid'>('list')

  const filteredEntries = useMemo(
    () =>
      entriesQuery.data?.filter(
        entry =>
          entry.title
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) &&
          (selected.collection !== null
            ? entry.collection === selected.collection
            : true) &&
          (selected.language !== null
            ? entry.languages.includes(selected.language)
            : true) &&
          (selected.collection !== null
            ? entry.collection === selected.collection
            : true) &&
          (selected.favourite ? entry.is_favourite : true) &&
          (selected.fileType !== null
            ? entry.extension ===
              fileTypesQuery.data?.find(
                fileType => fileType.id === selected.fileType
              )?.name
            : true)
      ) ?? [],
    [entriesQuery.data, debouncedSearchQuery, selected, fileTypesQuery.data]
  )

  const handleOpenLibgenModal = useCallback(() => {
    open(LibgenModal, {})
  }, [])

  return (
    <ModuleWrapper>
      <ModuleHeader
        contextMenuProps={{
          classNames: {
            wrapper: 'block md:hidden'
          },
          children: (
            <ContextMenuSelectorWrapper icon="tabler:eye" title="View as">
              {['grid', 'list'].map(type => (
                <ContextMenuItem
                  key={type}
                  icon={type === 'grid' ? 'uil:apps' : 'uil:list-ul'}
                  isToggled={view === type}
                  text={type.charAt(0).toUpperCase() + type.slice(1)}
                  onClick={() => {
                    setView(type as 'grid' | 'list')
                  }}
                />
              ))}
            </ContextMenuSelectorWrapper>
          )
        }}
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
          <div className="mt-4 flex items-center gap-2">
            <SearchInput
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
          <ContextMenuItem
            icon="tabler:upload"
            namespace="apps.booksLibrary"
            text="Upload from device"
            onClick={() => {}}
          />
          <ContextMenuItem
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
