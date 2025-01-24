import React, { useState } from 'react'
import { Button } from '@components/buttons'
import ModalWrapper from '@components/modals/ModalWrapper'
import APIRequest from '@utils/fetchData'

function EmptyTrashConfirmationModal({
  isOpen,
  setOpen,
  refreshPhotos
}: {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  refreshPhotos: () => void
}): React.ReactElement {
  const [loading, setLoading] = useState(false)

  async function deleteData(): Promise<void> {
    setLoading(true)

    await APIRequest({
      endpoint: 'photos/trash/empty',
      method: 'DELETE',
      successInfo: 'delete',
      failureInfo: 'delete',
      callback: () => {
        refreshPhotos()
      },
      onFailure: () => {
        setOpen(false)
      },
      finalCallback: () => {
        setLoading(false)
        setOpen(false)
      }
    })
  }

  return (
    <ModalWrapper isOpen={isOpen}>
      <h1 className="text-2xl font-semibold text-bg-50">
        Are you sure you want empty the trash?
      </h1>
      <p className="mt-2 text-bg-500">
        This will permanently delete all the photos in the trash. You can&apos;t
        undo this action.
      </p>
      <div className="mt-6 flex w-full justify-around gap-2">
        <Button
          onClick={() => {
            setOpen(false)
          }}
          variant="secondary"
          icon=""
          className="w-full"
        >
          Cancel
        </Button>
        <Button
          loading={loading}
          onClick={() => {
            deleteData().catch(console.error)
          }}
          icon="tabler:trash"
          className="w-full"
          isRed
        >
          Empty
        </Button>
      </div>
    </ModalWrapper>
  )
}

export default EmptyTrashConfirmationModal
