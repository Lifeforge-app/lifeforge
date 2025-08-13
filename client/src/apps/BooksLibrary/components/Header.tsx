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
    miscellaneous: { setSidebarOpen, searchQuery, selected, setSelected }
  } = useBooksLibraryContext()

  const handleOpenLibgenModal = useCallback(() => {
    open(LibgenModal, {})
  }, [])

  return (
    <div>
      <div className="flex-between flex">
        <h1 className="text-3xl font-semibold">
          {Object.values(selected).every(value => !value) && !searchQuery.trim()
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
              setSelected('collection', value)
            } else {
              setSelected('collection', null)
            }
          },
          fileType: value => {
            if (value) {
              setSelected('fileType', value)
            } else {
              setSelected('fileType', null)
            }
          },
          language: value => {
            if (value) {
              setSelected('language', value)
            } else {
              setSelected('language', null)
            }
          }
        }}
        values={{
          collection: selected.collection ?? '',
          fileType: selected.fileType ?? '',
          language: selected.language ?? ''
        }}
      />
    </div>
  )
}

export default Header
