import { useMutation, useQueryClient } from '@tanstack/react-query'
import forceDown from '@utils/forceDown'
import forgeAPI from '@utils/forgeAPI'
import { ConfirmationModal, ContextMenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import ModifyBookModal from '@apps/BooksLibrary/modals/ModifyBookModal'
import SendToKindleModal from '@apps/BooksLibrary/modals/SendToKindleModal'
import type { BooksLibraryEntry } from '@apps/BooksLibrary/providers/BooksLibraryProvider'

export default function EntryContextMenu({
  item
}: {
  item: BooksLibraryEntry
}) {
  const open = useModalStore(state => state.open)

  const queryClient = useQueryClient()

  const [downloadLoading, setDownloadLoading] = useState(false)

  const [readStatusChangeLoading, setReadStatusChangeLoading] = useState(false)

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
      buttonType: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }, [item])

  return (
    <>
      <ContextMenuItem
        icon={item.is_read ? 'tabler:check' : 'tabler:circle'}
        loading={readStatusChangeLoading}
        namespace="apps.booksLibrary"
        text={item.is_read ? 'Mark as Unread' : 'Mark as Read'}
        onClick={() => {
          setReadStatusChangeLoading(true)
          readStatusChangeMutation.mutate({})
        }}
      />
      <ContextMenuItem
        icon="tabler:brand-amazon"
        namespace="apps.booksLibrary"
        text="Send to Kindle"
        onClick={handleSendToKindle}
      />
      <ContextMenuItem
        disabled={downloadLoading}
        icon={downloadLoading ? 'svg-spinners:180-ring' : 'tabler:download'}
        text="Download"
        onClick={handleDownload}
      />
      <ContextMenuItem
        icon="tabler:pencil"
        text="Edit"
        onClick={handleUpdateEntry}
      />
      <ContextMenuItem
        isRed
        icon="tabler:trash"
        text="Delete"
        onClick={handleDeleteEntry}
      />
    </>
  )
}
