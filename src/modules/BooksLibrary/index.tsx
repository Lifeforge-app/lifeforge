import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { useDebounce } from '@uidotdev/usehooks'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Button } from '@components/buttons'
import HamburgerSelectorWrapper from '@components/buttons/HamburgerMenu/components/HamburgerSelectorWrapper'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { SearchInput } from '@components/inputs'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import ViewModeSelector from '@components/utilities/ViewModeSelector'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'
import Header from './components/Header'
import LibgenModal from './components/LibgenModal'
import ModifyBookModal from './components/ModifyBookModal'
import ModifyModal from './components/ModifyModal'
import Sidebar from './components/Sidebar'
import GridView from './views/GridView'
import ListView from './views/ListView'

function BooksLibrary(): React.ReactElement {
  const [searchParams] = useSearchParams()
  const {
    entries: {
      data: entries,
      refreshData: refreshEntries,
      deleteDataConfirmationModalOpen: deleteBookConfirmationModalOpen,
      setDeleteDataConfirmationOpen: setDeleteBookConfirmationModalOpen,
      existedData: existedBookData,
      setExistedData: setExistedBookData
    },
    fileTypes: { data: fileTypes, refreshData: refreshFileTypes },
    miscellaneous: {
      deleteModalConfigs,
      searchQuery,
      setSearchQuery,
      setLibgenModalOpen
    }
  } = useBooksLibraryContext()
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500)
  const [filteredEntries, setFilteredEntries] = useState(entries)
  const [view, setView] = useState<'list' | 'grid'>('list')

  useEffect(() => {
    if (typeof entries === 'string') return

    const filteredEntries = entries.filter(
      entry =>
        entry.title
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) &&
        (searchParams.get('category') !== null
          ? entry.category === searchParams.get('category')
          : true) &&
        (searchParams.get('language') !== null
          ? entry.languages.includes(searchParams.get('language') as string)
          : true) &&
        (searchParams.get('favourite') === 'true'
          ? entry.is_favourite
          : true) &&
        (searchParams.get('fileType') !== null && typeof fileTypes !== 'string'
          ? entry.extension ===
            fileTypes.find(
              fileType => fileType.id === searchParams.get('fileType')
            )?.name
          : true)
    )

    setFilteredEntries(filteredEntries)
  }, [entries, debouncedSearchQuery, searchParams, fileTypes])

  return (
    <ModuleWrapper>
      <ModuleHeader
        hamburgerMenuClassName="block md:hidden"
        hamburgerMenuItems={
          <HamburgerSelectorWrapper icon="tabler:eye" title="View as">
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
          </HamburgerSelectorWrapper>
        }
        icon="tabler:books"
        title="Books Library"
      />
      <div className="mt-6 flex min-h-0 w-full min-w-0 flex-1">
        <Sidebar />
        <div className="flex h-full min-h-0 flex-1 flex-col pb-8 xl:ml-8">
          <Header
            itemCount={
              typeof filteredEntries !== 'string' ? filteredEntries.length : 0
            }
          />
          <div className="flex items-center gap-2">
            <SearchInput
              namespace="modules.booksLibrary"
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
          <APIFallbackComponent data={filteredEntries}>
            {filteredEntries => {
              if (filteredEntries.length === 0) {
                if (entries.length === 0) {
                  return (
                    <EmptyStateScreen
                      icon="tabler:books-off"
                      name="book"
                      namespace="modules.booksLibrary"
                    />
                  )
                }

                return (
                  <EmptyStateScreen
                    icon="tabler:search-off"
                    name="result"
                    namespace="modules.booksLibrary"
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
          </APIFallbackComponent>
        </div>
      </div>
      <LibgenModal />
      {(['categories', 'languages'] as const).map(stuff => (
        <ModifyModal key={`modify-modal-${stuff}`} stuff={stuff} />
      ))}
      <ModifyBookModal />
      {deleteModalConfigs.map(config => (
        <DeleteConfirmationModal
          key={`delete-confirmation-modal-${config.apiEndpoint}`}
          apiEndpoint={config.apiEndpoint}
          data={config.data}
          isOpen={config.isOpen}
          itemName={config.itemName}
          nameKey={config.nameKey}
          updateDataList={config.updateDataList}
          onClose={() => {
            config.setOpen(false)
            config.setData(null)
          }}
        />
      ))}
      <DeleteConfirmationModal
        apiEndpoint="books-library/entries"
        data={existedBookData}
        isOpen={deleteBookConfirmationModalOpen}
        itemName="book"
        nameKey="title"
        updateDataList={() => {
          refreshEntries()
          refreshFileTypes()
        }}
        onClose={() => {
          setDeleteBookConfirmationModalOpen(false)
          setExistedBookData(null)
        }}
      />
      <Menu as="div" className="fixed right-6 bottom-6 z-50 block md:hidden">
        <Button as={MenuButton} icon="tabler:plus" onClick={() => {}}></Button>
        <MenuItems
          transition
          anchor="top end"
          className="bg-bg-100 dark:bg-bg-800 overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out [--anchor-gap:6px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
        >
          <MenuItem
            icon="tabler:upload"
            text="Upload from device"
            onClick={() => {}}
          />
          <MenuItem
            icon="tabler:books"
            text="Download from Libgen"
            onClick={() => {
              setLibgenModalOpen(true)
            }}
          />
        </MenuItems>
      </Menu>
    </ModuleWrapper>
  )
}

export default BooksLibrary
