import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'

import { MenuItem } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

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

  const handleUpdateEntry = useCallback(() => {
    open('booksLibrary.modifyBook', {
      type: 'update',
      existedData: item
    })
  }, [item])

  const handleDeleteEntry = useCallback(() => {
    open('deleteConfirmation', {
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
        disabled={downloadLoading}
        icon={downloadLoading ? 'svg-spinners:180-ring' : 'tabler:download'}
        text="Download"
        onClick={() => {
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
        }}
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
