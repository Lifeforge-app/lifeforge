import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@components/buttons'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import HeaderFilter from '@components/utilities/HeaderFilter'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'

function Header({ itemCount }: { itemCount: number }): React.ReactElement {
  const { t } = useTranslation('modules.booksLibrary')
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
          Books <span className="text-base text-bg-500">({itemCount})</span>
        </h1>
        <div className="flex items-center gap-6">
          <Menu as="div" className="relative z-50 hidden md:block">
            <Button
              onClick={() => {}}
              icon="tabler:plus"
              className="hidden sm:flex"
              as={MenuButton}
              tProps={{
                item: t('items.book')
              }}
            >
              new
            </Button>
            <MenuItems
              transition
              anchor="bottom end"
              className="mt-2 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-hidden transition duration-100 ease-out focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 dark:bg-bg-800"
            >
              <MenuItem
                onClick={() => {}}
                icon="tabler:upload"
                namespace="modules.booksLibrary"
                text="Upload from device"
              />
              <MenuItem
                onClick={() => {
                  setLibgenModalOpen(true)
                }}
                icon="tabler:books"
                namespace="modules.booksLibrary"
                text="Download from Libgen"
              />
            </MenuItems>
          </Menu>
          <Button
            onClick={() => {
              setSidebarOpen(true)
            }}
            variant="no-bg"
            icon="tabler:menu"
            className="lg:hidden"
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
