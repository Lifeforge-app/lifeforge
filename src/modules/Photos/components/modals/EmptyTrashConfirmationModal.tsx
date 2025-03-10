import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import ModalWrapper from '@components/modals/ModalWrapper'
import fetchAPI from '@utils/fetchAPI'

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

    try {
      await fetchAPI('photos/trash/empty', {
        method: 'DELETE'
      })

      refreshPhotos()
    } catch {
      toast.error('Failed to empty trash')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <ModalWrapper isOpen={isOpen}>
      <h1 className="text-bg-50 text-2xl font-semibold">
        Are you sure you want empty the trash?
      </h1>
      <p className="text-bg-500 mt-2">
        This will permanently delete all the photos in the trash. You can&apos;t
        undo this action.
      </p>
      <div className="mt-6 flex w-full justify-around gap-2">
        <Button
          className="w-full"
          icon=""
          variant="secondary"
          onClick={() => {
            setOpen(false)
          }}
        >
          Cancel
        </Button>
        <Button
          isRed
          className="w-full"
          icon="tabler:trash"
          loading={loading}
          onClick={() => {
            deleteData().catch(console.error)
          }}
        >
          Empty
        </Button>
      </div>
    </ModalWrapper>
  )
}

export default EmptyTrashConfirmationModal
