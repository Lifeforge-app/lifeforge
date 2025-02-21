import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { SidebarItem } from '@components/layouts/sidebar'
import {
  type IBooksLibraryFileType,
  type IBooksLibraryCategory,
  type IBooksLibraryLanguage
} from '@interfaces/books_library_interfaces'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'

const recordKeyInDB = {
  categories: 'category',
  languages: 'languages',
  fileTypes: 'file_type'
}

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
}): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    entries: { data: entries },
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
        number={
          item.count ??
          (typeof entries !== 'string'
            ? entries.filter(entry =>
                Array.isArray(entry[recordKeyInDB[stuff] as keyof typeof entry])
                  ? (
                      entry[
                        recordKeyInDB[stuff] as keyof typeof entry
                      ] as string[]
                    ).includes(item.id)
                  : entry[recordKeyInDB[stuff] as keyof typeof entry] ===
                    item.id
              ).length
            : 0)
        }
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
