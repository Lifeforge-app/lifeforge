import ModifyBookModal from '@/components/modals/ModifyBookModal'
import SendToKindleModal from '@/components/modals/SendToKindleModal'
import type { BooksLibraryEntry } from '@/providers/BooksLibraryProvider'
import forgeAPI from '@/utils/forgeAPI'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ConfirmationModal, ContextMenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { forceDown } from 'shared'

export default function EntryContextMenu({
  item
}: {
  item: BooksLibraryEntry
}) {
  const open = useModalStore(state => state.open)

  const queryClient = useQueryClient()

  const [downloadLoading, setDownloadLoading] = useState(false)

  const [readStatusChangeLoading, setReadStatusChangeLoading] = useState(false)

  const [addToFavouritesLoading, setAddToFavouritesLoading] = useState(false)

  const toggleFavouriteStatusMutation = useMutation(
    forgeAPI.booksLibrary.entries.toggleFavouriteStatus
      .input({
        id: item.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['booksLibrary', 'entries']
          })
        },
        onSettled: () => {
          setAddToFavouritesLoading(false)
        }
      })
  )

  const handleDownload = useCallback(() => {
    setDownloadLoading(true)
    forceDown(
      forgeAPI.media.input({
        collectionId: item.collectionId,
        recordId: item.id,
        fieldId: item.file
      }).endpoint,
      `${item.title}.${item.extension}`
    )
      .then(() => {
        setDownloadLoading(false)
      })
      .catch(console.error)
  }, [item])

  const readStatusChangeMutation = useMutation(
    forgeAPI.booksLibrary.entries.toggleReadStatus
      .input({
        id: item.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['booksLibrary', 'entries']
          })
          queryClient.invalidateQueries({
            queryKey: ['booksLibrary', 'readStatus']
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
      initialData: item
    })
  }, [item])

  const deleteMutation = useMutation(
    forgeAPI.booksLibrary.entries.remove
      .input({
        id: item.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['booksLibrary', 'entries']
          })
          queryClient.invalidateQueries({
            queryKey: ['booksLibrary', 'fileTypes']
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
        await deleteMutation.mutateAsync({})
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
        namespace="apps.booksLibrary"
        onClick={() => {
          setReadStatusChangeLoading(true)
          readStatusChangeMutation.mutate({})
        }}
      />
      <ContextMenuItem
        icon={item.is_favourite ? 'tabler:heart-off' : 'tabler:heart'}
        label="Add to Favourites"
        loading={addToFavouritesLoading}
        namespace="apps.booksLibrary"
        onClick={() => {
          setAddToFavouritesLoading(true)
          toggleFavouriteStatusMutation.mutate({})
        }}
      />
      <ContextMenuItem
        icon="tabler:brand-amazon"
        label="Send to Kindle"
        namespace="apps.booksLibrary"
        onClick={handleSendToKindle}
      />
      <ContextMenuItem
        disabled={downloadLoading}
        icon={downloadLoading ? 'svg-spinners:180-ring' : 'tabler:download'}
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
