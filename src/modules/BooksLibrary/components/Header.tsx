import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '@components/ButtonsAndInputs/Button'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import HeaderFilter from '@components/Miscellaneous/HeaderFilter'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'

function Header({ itemCount }: { itemCount: number }): React.ReactElement {
  const {
    categories: { data: categories },
    languages: { data: languages },
    miscellaneous: { searchQuery, setLibgenModalOpen }
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
        <Menu as="div" className="relative z-50 hidden md:block">
          <Button
            onClick={() => {}}
            icon="tabler:plus"
            className="hidden sm:flex"
            CustomElement={MenuButton}
          >
            add Book
          </Button>
          <MenuItems
            transition
            anchor="bottom end"
            className="mt-2 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-none transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-bg-800"
          >
            <MenuItem
              onClick={() => {}}
              icon="tabler:upload"
              text="Upload from device"
            />
            <MenuItem
              onClick={() => {
                setLibgenModalOpen(true)
              }}
              icon="tabler:books"
              text="Download from Libgen"
            />
          </MenuItems>
        </Menu>
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
          }
        }}
      />
    </div>
  )
}

export default Header
