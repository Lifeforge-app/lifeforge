import React, { useState } from 'react'
import { Button } from '@components/buttons'
import ModalWrapper from '@components/modals/ModalWrapper'

function CheckoutConfirmationModal({
  isOpen,
  onClose,
  onConfirm
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: (notes: string) => Promise<void>
}): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState('')

  return (
    <ModalWrapper isOpen={isOpen}>
      <h1 className="text-2xl font-semibold">Before checking out...</h1>
      <p className="mt-2 text-bg-500">
        By clicking checkout, this set of items will be added into your wardrobe
        history. You can view them in the &quot;Histories&quot; page.
      </p>
      <div className="mt-4 size-full rounded-lg bg-bg-200/70 p-6 shadow-custom transition-all focus-within:ring-1 focus-within:ring-bg-300 dark:bg-bg-800/50 dark:focus-within:ring-bg-500">
        <textarea
          className="h-max min-h-32 w-full resize-none bg-transparent caret-custom-500 placeholder:text-bg-500"
          placeholder="Any additional notes?"
          value={notes}
          onChange={e => {
            setNotes(e.target.value)
          }}
        />
      </div>
      <div className="mt-6 flex w-full flex-col-reverse justify-around gap-2 sm:flex-row">
        <Button
          className="w-full"
          icon=""
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          iconAtEnd
          className="w-full"
          icon="tabler:arrow-right"
          loading={loading}
          onClick={() => {
            setLoading(true)
            onConfirm(notes)
              .catch(console.error)
              .finally(() => {
                setLoading(false)
                onClose()
              })
          }}
        >
          Checkout
        </Button>
      </div>
    </ModalWrapper>
  )
}

export default CheckoutConfirmationModal
