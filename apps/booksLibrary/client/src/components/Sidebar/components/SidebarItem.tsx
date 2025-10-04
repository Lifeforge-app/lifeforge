import ModifyModal from '@/components/modals/ModifyModal'
import useFilter from '@/hooks/useFilter'
import forgeAPI from '@/utils/forgeAPI'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ConfirmationModal, ContextMenuItem, SidebarItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { toast } from 'react-toastify'

import {
  type BooksLibraryCollection,
  type BooksLibraryFileType,
  type BooksLibraryLanguage
} from '../../../providers/BooksLibraryProvider'

function _SidebarItem({
  item,
  stuff,
  fallbackIcon,
  hasContextMenu = true,
  useNamespace = false
}: {
  item: BooksLibraryCollection | BooksLibraryLanguage | BooksLibraryFileType
  stuff: 'collections' | 'languages' | 'fileTypes' | 'readStatus'
  fallbackIcon?: string
  hasContextMenu?: boolean
  useNamespace?: boolean
}) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const { updateFilter, collection, fileType, language, readStatus } =
    useFilter()

  const singleStuff = (
    {
      collections: 'collection',
      languages: 'language',
      fileTypes: 'fileType',
      readStatus: 'readStatus'
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
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }, [item, stuff])

  return (
    <>
      <SidebarItem
        active={
          {
            collection,
            fileType,
            language,
            readStatus
          }[singleStuff] === item.id
        }
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
        namespace={useNamespace ? 'apps.booksLibrary' : undefined}
        number={item.amount}
        sideStripColor={'color' in item ? (item.color as string) : undefined}
        onCancelButtonClick={() => {
          updateFilter(singleStuff, null)
        }}
        onClick={() => {
          updateFilter(singleStuff, item.id)
        }}
      />
    </>
  )
}

export default _SidebarItem
