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
      <p className="text-bg-500 mt-2">
        By clicking checkout, this set of items will be added into your wardrobe
        history. You can view them in the &quot;Histories&quot; page.
      </p>
      <div className="bg-bg-200/70 shadow-custom focus-within:ring-bg-300 dark:bg-bg-800/50 dark:focus-within:ring-bg-500 mt-4 size-full rounded-lg p-6 transition-all focus-within:ring-1">
        <textarea
          className="caret-custom-500 placeholder:text-bg-500 h-max min-h-32 w-full resize-none bg-transparent"
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
