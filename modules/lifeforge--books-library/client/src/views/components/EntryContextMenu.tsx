import type { BooksLibraryEntry } from '@'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'

import {
  ConfirmationModal,
  ContextMenuItem,
  toast,
  useModalStore
} from '@lifeforge/ui'

import ModifyBookModal from '@/components/modals/ModifyBookModal'
import SendToKindleModal from '@/components/modals/SendToKindleModal'
import { forgeAPI } from '@/manifest'

export default function EntryContextMenu({
  item
}: {
  item: BooksLibraryEntry
}) {
  const { open } = useModalStore()
  const queryClient = useQueryClient()
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [readStatusChangeLoading, setReadStatusChangeLoading] = useState(false)
  const [addToFavouritesLoading, setAddToFavouritesLoading] = useState(false)

  const toggleFavouriteStatusMutation = useMutation(
    forgeAPI.entries.toggleFavouriteStatus
      .input({
        id: item.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: forgeAPI.entries.key
          })
        },
        onSettled: () => {
          setAddToFavouritesLoading(false)
        }
      })
  )

  const handleDownload = useCallback(() => {
    setDownloadLoading(true)

    const a = document.createElement('a')

    a.href = forgeAPI.getMedia({
      collectionId: item.collectionId,
      recordId: item.id,
      fieldId: item.file
    })
    a.download = `${item.title}.${item.extension}`
    a.click()
    setDownloadLoading(false)
  }, [item])

  const readStatusChangeMutation = useMutation(
    forgeAPI.entries.toggleReadStatus
      .input({
        id: item.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: forgeAPI.entries.key
          })
          queryClient.invalidateQueries({
            queryKey: forgeAPI.readStatus.key
          })
        },
        onSettled: () => {
          setReadStatusChangeLoading(false)
        }
      })
  )

  const handleSendToKindle = useCallback(() => {
    open(SendToKindleModal, {
      bookId: item.id
    })
  }, [item])

  const handleUpdateEntry = useCallback(() => {
    open(ModifyBookModal, {
      type: 'update',
      initialData: {
        ...item,
        file: {
          type: 'existing' as const,
          id: item.id,
          filename: item.file
        }
      }
    })
  }, [item])

  const deleteMutation = useMutation(
    forgeAPI.entries.remove
      .input({
        id: item.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: forgeAPI.entries.key
          })
          queryClient.invalidateQueries({
            queryKey: forgeAPI.fileTypes.key
          })
        },
        onError: () => {
          toast.error('Failed to delete book')
        }
      })
  )

  const handleDeleteEntry = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Book',
      description: `Are you sure you want to delete ${item.title}?`,
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)
      }
    })
  }, [item])

  return (
    <>
      <ContextMenuItem
        icon={
          {
            unread: 'tabler:progress-bolt',
            read: 'tabler:progress',
            reading: 'tabler:progress-check'
          }[item.read_status]
        }
        label={`Mark as ${
          {
            unread: 'Reading',
            read: 'Unread',
            reading: 'Read'
          }[item.read_status]
        }`}
        loading={readStatusChangeLoading}
        onClick={() => {
          setReadStatusChangeLoading(true)
          readStatusChangeMutation.mutate(undefined)
        }}
      />
      <ContextMenuItem
        icon={item.is_favourite ? 'tabler:heart-off' : 'tabler:heart'}
        label="Add to Favourites"
        loading={addToFavouritesLoading}
        onClick={() => {
          setAddToFavouritesLoading(true)
          toggleFavouriteStatusMutation.mutate(undefined)
        }}
      />
      <ContextMenuItem
        icon="tabler:brand-amazon"
        label="Send to Kindle"
        onClick={handleSendToKindle}
      />
      <ContextMenuItem
        disabled={downloadLoading}
        icon={downloadLoading ? 'svg-spinners:ring-resize' : 'tabler:download'}
        label="Download"
        onClick={handleDownload}
      />
      <ContextMenuItem
        icon="tabler:pencil"
        label="Edit"
        onClick={handleUpdateEntry}
      />
      <ContextMenuItem
        dangerous
        icon="tabler:trash"
        label="Delete"
        onClick={handleDeleteEntry}
      />
    </>
  )
}
