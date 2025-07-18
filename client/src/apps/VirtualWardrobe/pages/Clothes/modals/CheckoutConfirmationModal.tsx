import { useQueryClient } from '@tanstack/react-query'
import { Button, ModalHeader, TextAreaInput } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'

import { IVirtualWardrobeEntry } from '@apps/VirtualWardrobe/interfaces/virtual_wardrobe_interfaces'

function CheckoutConfirmationModal({
  data: { queryKey },
  onClose
}: {
  data: { queryKey: unknown[] }
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('apps.virtualWardrobe')
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState('')

  async function handleCheckout() {
    setLoading(true)

    try {
      await fetchAPI(
        import.meta.env.VITE_API_HOST,
        'virtual-wardrobe/session/checkout',
        {
          method: 'POST',
          body: {
            notes
          }
        }
      )

      queryClient.setQueryData<IVirtualWardrobeEntry[]>(
        ['virtual-wardrobe', 'session-cart-items'],
        []
      )

      queryClient.invalidateQueries({ queryKey })
    } catch {
      toast.error('Failed to checkout')
    } finally {
      setLoading(false)
      onClose()

      setTimeout(() => {
        onClose()
      }, 500)
    }
  }

  return (
    <div>
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
          onClick={handleCheckout}
        >
          Checkout
        </Button>
      </div>
    </div>
  )
}

export default CheckoutConfirmationModal
