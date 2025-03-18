import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { Button, HeaderFilter, MenuItem } from '@lifeforge/ui'

import { useBooksLibraryContext } from '../providers/BooksLibraryProvider'

function Header({ itemCount }: { itemCount: number }) {
  const { t } = useTranslation('apps.booksLibrary')
  const {
    categories: { data: categories },
    languages: { data: languages },
    fileTypes: { data: fileTypes },
    miscellaneous: { setSidebarOpen, searchQuery, setLibgenModalOpen }
  } = useBooksLibraryContext()
  const [searchParams] = useSearchParams()

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
              className="bg-bg-100 dark:bg-bg-800 outline-hidden focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 mt-2 overflow-hidden overscroll-contain rounded-md shadow-lg transition duration-100 ease-out"
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
                onClick={() => {
                  setLibgenModalOpen(true)
                }}
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
          category: {
            data: categories,
            isColored: true
          },
          language: {
            data: languages,
            isColored: true
          },
          fileType: {
            data:
              typeof fileTypes !== 'string'
                ? fileTypes.map(e => ({ ...e, icon: 'tabler:file-text' }))
                : []
          }
        }}
      />
    </div>
  )
}

export default Header
