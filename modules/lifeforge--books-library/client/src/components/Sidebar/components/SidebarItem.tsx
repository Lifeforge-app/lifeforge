import type {
  BooksLibraryCollection,
  BooksLibraryFileType,
  BooksLibraryLanguage
} from '@'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import {
  ConfirmationModal,
  ContextMenuItem,
  SidebarItem,
  toast,
  useModalStore
} from '@lifeforge/ui'

import ModifyModal from '@/components/modals/ModifyModal'
import useFilter from '@/hooks/useFilter'
import { forgeAPI } from '@/manifest'

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
  const { open } = useModalStore()

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
    forgeAPI[stuff as 'collections' | 'languages'].remove
      .input({
        id: item.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: forgeAPI[stuff].key
          })

          queryClient.invalidateQueries({
            queryKey: forgeAPI.entries.key
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
        await deleteMutation.mutateAsync(undefined)
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
        namespace={useNamespace ? undefined : false}
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
