import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { ConfirmationModal, ContextMenuItem, SidebarItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
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
  hasContextMenu = true
}: {
  item: BooksLibraryCollection | BooksLibraryLanguage | BooksLibraryFileType
  stuff: 'collections' | 'languages' | 'fileTypes'
  fallbackIcon?: string
  hasContextMenu?: boolean
}) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const {
    miscellaneous: { filter, setFilter, setSidebarOpen }
  } = useBooksLibraryContext()

  const singleStuff = (
    {
      collections: 'collection',
      languages: 'language',
      fileTypes: 'fileType'
    } as const
  )[stuff]

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
        active={filter[singleStuff] === item.id}
        contextMenuItems={
          hasContextMenu ? (
            <>
              <ContextMenuItem
                icon="tabler:pencil"
                label="Edit"
                onClick={handleUpdateStuff}
              />
              <ContextMenuItem
                dangerous
                icon="tabler:trash"
                label="Delete"
                onClick={handleDeleteStuff}
              />
            </>
          ) : undefined
        }
        icon={'icon' in item ? item.icon : fallbackIcon}
        label={item.name}
        number={item.amount}
        onCancelButtonClick={() => {
          setFilter(singleStuff, null)
        }}
        onClick={() => {
          setSidebarOpen(false)
          setFilter(singleStuff, item.id)
        }}
      />
    </>
  )
}

export default _SidebarItem
