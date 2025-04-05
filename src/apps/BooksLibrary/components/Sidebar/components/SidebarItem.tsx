import { useMemo } from 'react'
import { useSearchParams } from 'react-router'

import { MenuItem, SidebarItem } from '@lifeforge/ui'

import {
  type IBooksLibraryCategory,
  type IBooksLibraryFileType,
  type IBooksLibraryLanguage
} from '../../../interfaces/books_library_interfaces'
import { useBooksLibraryContext } from '../../../providers/BooksLibraryProvider'

function _SidebarItem({
  item,
  stuff,
  fallbackIcon,
  hasHamburgerMenu = true
}: {
  item: IBooksLibraryCategory | IBooksLibraryLanguage | IBooksLibraryFileType
  stuff: 'categories' | 'languages' | 'fileTypes'
  fallbackIcon?: string
  hasHamburgerMenu?: boolean
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    miscellaneous: { setSidebarOpen },
    ...booksLibraryContext
  } = useBooksLibraryContext()

  const {
    setExistedData,
    setModifyDataModalOpenType,
    setDeleteDataConfirmationOpen
  } = booksLibraryContext[stuff]

  const singleStuff = useMemo(
    () => stuff.replace(/ies$/, 'y').replace(/s$/, ''),
    [stuff]
  )

  return (
    <>
      <SidebarItem
        active={searchParams.get(singleStuff) === item.id}
        hamburgerMenuItems={
          hasHamburgerMenu ? (
            <>
              <MenuItem
                icon="tabler:pencil"
                text="Edit"
                onClick={e => {
                  e.stopPropagation()
                  setExistedData(item as any)
                  setModifyDataModalOpenType('update')
                }}
              />
              <MenuItem
                isRed
                icon="tabler:trash"
                text="Delete"
                onClick={e => {
                  e.stopPropagation()
                  setExistedData(item as any)
                  setDeleteDataConfirmationOpen(true)
                }}
              />
            </>
          ) : undefined
        }
        icon={item.icon ?? fallbackIcon}
        name={item.name}
        number={item.amount}
        onCancelButtonClick={() => {
          searchParams.delete(singleStuff)
          setSearchParams(searchParams)
          setSidebarOpen(false)
        }}
        onClick={() => {
          setSidebarOpen(false)
          setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            [singleStuff]: item.id
          })
        }}
      />
    </>
  )
}

export default _SidebarItem
