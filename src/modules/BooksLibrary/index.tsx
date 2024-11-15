import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'
import Header from './components/Header'
import LibgenModal from './components/LibgenModal'
import ModifyBookModal from './components/ModifyBookModal'
import ModifyModal from './components/ModifyModal'
import Sidebar from './components/Sidebar'
import GridView from './views/GridView'
import ListView from './views/ListView'

function BooksLibrary(): React.ReactElement {
  const {
    entries: {
      data: entries,
      refreshData: refreshEntries,
      deleteDataConfirmationModalOpen: deleteBookConfirmationModalOpen,
      setDeleteDataConfirmationOpen: setDeleteBookConfirmationModalOpen,
      existedData: existedBookData,
      setExistedData: setExistedBookData
    },
    miscellaneous: { deleteModalConfigs, searchQuery, setSearchQuery }
  } = useBooksLibraryContext()
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [searchParams] = useSearchParams()
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
        (searchParams.get('favourite') === 'true' ? entry.is_favourite : true)
    )

    setFilteredEntries(filteredEntries)
  }, [entries, debouncedSearchQuery, searchParams])

  return (
    <ModuleWrapper>
      <ModuleHeader title="Books Library" icon="tabler:books" />
      <div className="mt-6 flex min-h-0 w-full min-w-0 flex-1">
        <Sidebar />
        <div className="flex h-full min-h-0 flex-1 flex-col pb-8 xl:ml-8">
          <Header itemCount={filteredEntries.length} />
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
                      : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-50'
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
          <APIComponentWithFallback data={filteredEntries}>
            {filteredEntries =>
              filteredEntries.length > 0 ? (
                view === 'grid' ? (
                  <GridView books={filteredEntries} />
                ) : (
                  <ListView books={filteredEntries} />
                )
              ) : entries.length === 0 ? (
                <EmptyStateScreen
                  icon="tabler:books-off"
                  title={t('emptyState.booksLibrary.empty.title')}
                  description={t('emptyState.booksLibrary.empty.description')}
                />
              ) : (
                <EmptyStateScreen
                  icon="tabler:search-off"
                  title={t('emptyState.booksLibrary.results.title')}
                  description={t('emptyState.booksLibrary.results.description')}
                />
              )
            }
          </APIComponentWithFallback>
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
          isOpen={config.isOpen}
          data={config.data}
          itemName={config.itemName}
          nameKey={config.nameKey}
          onClose={() => {
            config.setOpen(false)
            config.setData(null)
          }}
          updateDataList={config.updateDataList}
        />
      ))}
      <DeleteConfirmationModal
        apiEndpoint="books-library/entries"
        data={existedBookData}
        isOpen={deleteBookConfirmationModalOpen}
        itemName="book"
        nameKey="title"
        onClose={() => {
          setDeleteBookConfirmationModalOpen(false)
          setExistedBookData(null)
        }}
        updateDataList={refreshEntries}
      />
    </ModuleWrapper>
  )
}

export default BooksLibrary
