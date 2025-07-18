import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Button, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import LibgenModal from '../modals/LibgenModal'
import { useBooksLibraryContext } from '../providers/BooksLibraryProvider'

function Header({ itemCount }: { itemCount: number }) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.booksLibrary')

  const {
    // categories: { dataQuery: categoriesQuery },
    // languages: { dataQuery: languagesQuery },
    // fileTypes: { dataQuery: fileTypesQuery },
    miscellaneous: { setSidebarOpen, searchQuery }
  } = useBooksLibraryContext()

  const [searchParams] = useSearchParams()

  const handleOpenLibgenModal = useCallback(() => {
    open(LibgenModal, {})
  }, [])

  return (
    <div>
      <div className="flex-between flex">
        <h1 className="text-3xl font-semibold sm:text-4xl">
          {Array.from(searchParams.keys()).filter(e => e !== 'favourite')
            .length === 0 || searchQuery !== ''
            ? 'All'
            : 'Filtered'}{' '}
          {searchParams.get('favourite') === 'true' ? 'Favourite ' : ''}
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
      {/* TODO <HeaderFilter
        items={{
          category: {
            data: categoriesQuery.data ?? [],
            isColored: true
          },
          language: {
            data: languagesQuery.data ?? [],
            isColored: true
          },
          fileType: {
            data:
              fileTypesQuery.data?.map(e => ({
                ...e,
                icon: 'tabler:file-text'
              })) ?? []
          }
        }}
      /> */}
    </div>
  )
}

export default Header
