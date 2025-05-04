import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, ModalHeader, ModalWrapper, TextAreaInput } from '@lifeforge/ui'

function CheckoutConfirmationModal({
  isOpen,
  onClose,
  onConfirm
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: (notes: string) => Promise<void>
}) {
  const { t } = useTranslation('apps.virtualWardrobe')
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState('')

  return (
    <ModalWrapper isOpen={isOpen} zIndex={10}>
      <ModalHeader
        icon="tabler:shopping-cart"
        namespace="apps.virtualWardrobe"
        title="Checkout"
        onClose={onClose}
      />
      <p className="text-bg-500 mt-2">{t('modals.checkout.desc')}</p>
      <TextAreaInput
        darker
        className="mt-4"
        icon="tabler:pencil"
        name="Notes"
        namespace="apps.virtualWardrobe"
        placeholder="Add notes here..."
        setValue={setNotes}
        value={notes}
      />
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
          namespace="apps.virtualWardrobe"
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
