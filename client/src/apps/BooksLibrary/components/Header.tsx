import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Button, ContextMenuItem, HeaderFilter } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import LibgenModal from '../modals/LibgenModal'
import { useBooksLibraryContext } from '../providers/BooksLibraryProvider'

function Header({ itemCount }: { itemCount: number }) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.booksLibrary')

  const {
    collectionsQuery,
    fileTypesQuery,
    languagesQuery,
    miscellaneous: { setSidebarOpen, searchQuery, filter, setFilter }
  } = useBooksLibraryContext()

  const handleOpenLibgenModal = useCallback(() => {
    open(LibgenModal, {})
  }, [])

  return (
    <div>
      <div className="flex-between flex">
        <h1 className="text-3xl font-semibold">
          {Object.values(filter).every(value => !value) && !searchQuery.trim()
            ? 'All'
            : 'Filtered'}{' '}
          Books <span className="text-bg-500 text-base">({itemCount})</span>
        </h1>
        <div className="flex items-center gap-6">
          <Menu as="div" className="relative z-50 hidden md:block">
            <Button
              as={MenuButton}
              className="hidden sm:flex"
              icon="tabler:plus"
              tProps={{
                item: t('items.book')
              }}
              onClick={() => {}}
            >
              new
            </Button>
            <MenuItems
              transition
              anchor="bottom end"
              className="bg-bg-100 dark:bg-bg-800 mt-2 overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
            >
              <ContextMenuItem
                icon="tabler:upload"
                label="Upload from device"
                namespace="apps.booksLibrary"
                onClick={() => {}}
              />
              <ContextMenuItem
                icon="tabler:books"
                label="Download from Libgen"
                namespace="apps.booksLibrary"
                onClick={handleOpenLibgenModal}
              />
            </MenuItems>
          </Menu>
          <Button
            className="lg:hidden"
            icon="tabler:menu"
            variant="plain"
            onClick={() => {
              setSidebarOpen(true)
            }}
          />
        </div>
      </div>
      <HeaderFilter
        items={{
          collection: {
            data: collectionsQuery.data ?? []
          },
          fileType: {
            data:
              fileTypesQuery.data?.map(e => ({
                id: e.id,
                name: e.name,
                icon: 'tabler:file-text'
              })) ?? []
          },
          language: {
            data: languagesQuery.data ?? []
          }
        }}
        setValues={{
          collection: value => {
            if (value) {
              setFilter('collection', value)
            } else {
              setFilter('collection', null)
            }
          },
          fileType: value => {
            if (value) {
              setFilter('fileType', value)
            } else {
              setFilter('fileType', null)
            }
          },
          language: value => {
            if (value) {
              setFilter('language', value)
            } else {
              setFilter('language', null)
            }
          }
        }}
        values={{
          collection: filter.collection ?? '',
          fileType: filter.fileType ?? '',
          language: filter.language ?? ''
        }}
      />
    </div>
  )
}

export default Header
