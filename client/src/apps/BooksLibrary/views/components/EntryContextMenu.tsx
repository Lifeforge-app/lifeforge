import { useQueryClient } from '@tanstack/react-query'
import { DeleteConfirmationModal, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useState } from 'react'

import ModifyBookModal from '@apps/BooksLibrary/modals/ModifyBookModal'
import SendToKindleModal from '@apps/BooksLibrary/modals/SendToKindleModal'

import fetchAPI from '@utils/fetchAPI'
import forceDown from '@utils/forceDown'

import { type IBooksLibraryEntry } from '../../interfaces/books_library_interfaces'

export default function EntryContextMenu({
  item
}: {
  item: IBooksLibraryEntry
}) {
  const open = useModalStore(state => state.open)
  const queryClient = useQueryClient()
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [readStatusChangeLoading, setReadStatusChangeLoading] = useState(false)

  const handleDownload = useCallback(() => {
    setDownloadLoading(true)
    forceDown(
      `${import.meta.env.VITE_API_HOST}/media/${item.collectionId}/${
        item.id
      }/${item.file}`,
      `${item.title}.${item.extension}`
    )
      .then(() => {
        setDownloadLoading(false)
      })
      .catch(console.error)
  }, [item])

  const handleReadStatusChange = useCallback(async () => {
    setReadStatusChangeLoading(true)

    try {
      await fetchAPI<IBooksLibraryEntry>(
        `books-library/entries/read/${item.id}`,
        {
          method: 'POST'
        }
      )

      queryClient.invalidateQueries({
        queryKey: ['books-library', 'entries']
      })
    } catch (error) {
      console.error('Failed to update read status:', error)
    } finally {
      setReadStatusChangeLoading(false)
    }
  }, [item, queryClient])

  const handleSendToKindle = useCallback(() => {
    open(SendToKindleModal, {
      bookId: item.id
    })
  }, [item])

  const handleUpdateEntry = useCallback(() => {
    open(ModifyBookModal, {
      type: 'update',
      existedData: item
    })
  }, [item])

  const handleDeleteEntry = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'books-library/entries',
      data: item,
      itemName: 'book',
      nameKey: 'title',
      updateDataList: () => {
        queryClient.invalidateQueries({
          queryKey: ['books-library', 'entries']
        })
        queryClient.invalidateQueries({
          queryKey: ['books-library', 'file-types']
        })
      }
    })
  }, [item])

  return (
    <>
      <MenuItem
        icon={item.is_read ? 'tabler:check' : 'tabler:circle'}
        loading={readStatusChangeLoading}
        namespace="apps.booksLibrary"
        text={item.is_read ? 'Mark as Unread' : 'Mark as Read'}
        onClick={handleReadStatusChange}
      />
      <MenuItem
        icon="tabler:brand-amazon"
        namespace="apps.booksLibrary"
        text="Send to Kindle"
        onClick={handleSendToKindle}
      />
      <MenuItem
        disabled={downloadLoading}
        icon={downloadLoading ? 'svg-spinners:180-ring' : 'tabler:download'}
        text="Download"
        onClick={handleDownload}
      />
      <MenuItem icon="tabler:pencil" text="Edit" onClick={handleUpdateEntry} />
      <MenuItem
        isRed
        icon="tabler:trash"
        text="Delete"
        onClick={handleDeleteEntry}
      />
    </>
  )
}
