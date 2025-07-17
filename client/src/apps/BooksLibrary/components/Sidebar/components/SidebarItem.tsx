import { DeleteConfirmationModal, MenuItem, SidebarItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'

import ModifyModal from '@apps/BooksLibrary/modals/ModifyModal'

import {
  type IBooksLibraryCollection,
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
  item: IBooksLibraryCollection | IBooksLibraryLanguage | IBooksLibraryFileType
  stuff: 'collections' | 'languages' | 'fileTypes'
  fallbackIcon?: string
  hasHamburgerMenu?: boolean
}) {
  const open = useModalStore(state => state.open)
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    miscellaneous: { setSidebarOpen }
  } = useBooksLibraryContext()

  const singleStuff = useMemo(
    () => stuff.replace(/ies$/, 'y').replace(/s$/, ''),
    [stuff]
  )

  const handleUpdateStuff = useCallback(() => {
    open(ModifyModal, {
      type: 'update',
      existedData: item,
      stuff: stuff as 'collections' | 'languages'
    })
  }, [item, stuff])

  const handleDeleteStuff = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: `books-library/${stuff}`,
      data: item,
      itemName: singleStuff,
      nameKey: 'name',
      queryKey: ['books-library', stuff]
    })
  }, [item, stuff])

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
                onClick={handleUpdateStuff}
              />
              <MenuItem
                isRed
                icon="tabler:trash"
                text="Delete"
                onClick={handleDeleteStuff}
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
