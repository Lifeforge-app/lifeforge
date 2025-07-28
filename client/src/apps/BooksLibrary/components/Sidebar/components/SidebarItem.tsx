import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { ConfirmationModal, MenuItem, SidebarItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { toast } from 'react-toastify'

import ModifyModal from '@apps/BooksLibrary/modals/ModifyModal'

import {
  type BooksLibraryCollection,
  type BooksLibraryFileType,
  type BooksLibraryLanguage,
  useBooksLibraryContext
} from '../../../providers/BooksLibraryProvider'

function _SidebarItem({
  item,
  stuff,
  fallbackIcon,
  hasHamburgerMenu = true
}: {
  item: BooksLibraryCollection | BooksLibraryLanguage | BooksLibraryFileType
  stuff: 'collections' | 'languages' | 'fileTypes'
  fallbackIcon?: string
  hasHamburgerMenu?: boolean
}) {
  const queryClient = useQueryClient()

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
      initialData: item,
      stuff: stuff as 'collections' | 'languages'
    })
  }, [item, stuff])

  const deleteMutation = useMutation(
    forgeAPI.booksLibrary[stuff as 'collections' | 'languages'].remove
      .input({
        id: item.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['booksLibrary', stuff]
          })

          queryClient.invalidateQueries({
            queryKey: ['booksLibrary', 'entries']
          })
        },
        onError: () => {
          toast.error(`Failed to delete ${singleStuff}`)
        }
      })
  )

  const handleDeleteStuff = useCallback(() => {
    open(ConfirmationModal, {
      title: `Delete ${singleStuff}`,
      description: `Are you sure you want to delete this ${singleStuff}?`,
      buttonType: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
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
        icon={'icon' in item ? item.icon : fallbackIcon}
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
