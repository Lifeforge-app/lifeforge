import React, { useMemo } from 'react'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import {
  type IBooksLibraryCategory,
  type IBooksLibraryLanguage
} from '@interfaces/books_library_interfaces'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'

const recordKeyInDB = {
  categories: 'category',
  languages: 'languages'
}

function _SidebarItem({
  item,
  stuff
}: {
  item: IBooksLibraryCategory | IBooksLibraryLanguage
  stuff: 'categories' | 'languages'
}): React.ReactElement {
  const {
    entries: { data: entries },
    miscellaneous: { searchParams, setSearchParams, setSidebarOpen },
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
        icon={item.icon}
        name={item.name}
        needTranslate={false}
        number={
          typeof entries !== 'string'
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
            : 0
        }
        onClick={() => {
          console.log('sus')
          setSidebarOpen(false)
          setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            [singleStuff]: item.id
          })
        }}
        onCancelButtonClick={() => {
          searchParams.delete(singleStuff)
          setSearchParams(searchParams)
          setSidebarOpen(false)
        }}
        hamburgerMenuItems={
          <>
            <MenuItem
              icon="tabler:edit"
              onClick={e => {
                e.stopPropagation()
                setExistedData(item as any)
                setModifyDataModalOpenType('update')
              }}
              text="Edit"
            />
            <MenuItem
              isRed
              icon="tabler:trash"
              onClick={e => {
                e.stopPropagation()
                setExistedData(item as any)
                setDeleteDataConfirmationOpen(true)
              }}
              text="Delete"
            />
          </>
        }
      />
    </>
  )
}

export default _SidebarItem
