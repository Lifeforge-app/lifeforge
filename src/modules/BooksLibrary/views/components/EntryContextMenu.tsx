import React, { useState } from 'react'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import { type IBooksLibraryEntry } from '@interfaces/books_library_interfaces'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'
import forceDown from '@utils/forceDown'

export default function EntryContextMenu({
  item
}: {
  item: IBooksLibraryEntry
}): React.ReactElement {
  const {
    entries: {
      setExistedData,
      setDeleteDataConfirmationOpen,
      setModifyDataModalOpenType
    }
  } = useBooksLibraryContext()
  const [downloadLoading, setDownloadLoading] = useState(false)

  return (
    <>
      <MenuItem
        icon={downloadLoading ? 'svg-spinners:180-ring' : 'tabler:download'}
        text="Download"
        disabled={downloadLoading}
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
      <MenuItem
        icon="tabler:pencil"
        text="Edit"
        onClick={() => {
          setExistedData(item)
          setModifyDataModalOpenType('update')
        }}
      />
      <MenuItem
        icon="tabler:trash"
        text="Delete"
        onClick={() => {
          setExistedData(item)
          setDeleteDataConfirmationOpen(true)
        }}
        isRed
      />
    </>
  )
}
