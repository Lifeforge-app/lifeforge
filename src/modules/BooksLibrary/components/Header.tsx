import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
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
              className="mt-2 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-hidden transition duration-100 ease-out focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 dark:bg-bg-800"
            >
              <MenuItem
                icon="tabler:upload"
                namespace="modules.booksLibrary"
                text="Upload from device"
                onClick={() => {}}
              />
              <MenuItem
                icon="tabler:books"
                namespace="modules.booksLibrary"
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
            variant="no-bg"
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
