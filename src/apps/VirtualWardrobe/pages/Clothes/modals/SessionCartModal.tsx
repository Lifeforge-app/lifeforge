import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { toast } from 'react-toastify'

import { Button, EmptyStateScreen, ModalHeader } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import { IVirtualWardrobeEntry } from '@apps/VirtualWardrobe/interfaces/virtual_wardrobe_interfaces'

import fetchAPI from '@utils/fetchAPI'

import EntryItem from '../components/EntryItem'
import CheckoutConfirmationModal from './CheckoutConfirmationModal'

function SessionCartModal({
  onClose,
  data: { cartItems, queryKey }
}: {
  onClose: () => void
  data: { cartItems: IVirtualWardrobeEntry[]; queryKey: unknown[] }
}) {
  const open = useModalStore(state => state.open)
  const queryClient = useQueryClient()

  async function handleRemoveFromCart(entryId: string) {
    try {
      await fetchAPI(`virtual-wardrobe/session/${entryId}`, {
        method: 'DELETE'
      })

      queryClient.setQueryData<IVirtualWardrobeEntry[]>(
        ['virtual-wardrobe', 'session-cart-items'],
        prev => {
          if (!prev) return []
          return prev.filter(entry => entry.id !== entryId)
        }
      )
    } catch {
      toast.error('Failed to remove item from cart')
    }
  }

  const handleOpenConfirmationModal = useCallback(() => {
    open(CheckoutConfirmationModal, {
      queryKey
    })
  }, [queryKey])

  return (
    <div className="min-w-[50vw]">
      <ModalHeader
        icon="tabler:shopping-bag"
        namespace="apps.virtualWardrobe"
        title="Session Cart"
        onClose={onClose}
      />
      {cartItems.length === 0 ? (
        <EmptyStateScreen
          smaller
          icon="tabler:icons-off"
          name="sessionCart"
          namespace="apps.virtualWardrobe"
        />
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map(entry => (
              <EntryItem
                key={entry.id}
                isCartItem
                entry={entry}
                onRemoveFromCart={async () => {
                  await handleRemoveFromCart(entry.id)
                }}
              />
            ))}
          </ul>

          <Button
            iconAtEnd
            className="mt-6 w-full"
            icon="tabler:arrow-right"
            namespace="apps.virtualWardrobe"
            onClick={handleOpenConfirmationModal}
          >
            Checkout
          </Button>
        </>
      )}
    </div>
  )
}

export default SessionCartModal
