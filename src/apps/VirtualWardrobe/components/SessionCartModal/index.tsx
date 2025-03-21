import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'

import {
  Button,
  EmptyStateScreen,
  ModalHeader,
  ModalWrapper
} from '@lifeforge/ui'

import { IVirtualWardrobeEntry } from '@apps/VirtualWardrobe/interfaces/virtual_wardrobe_interfaces'

import fetchAPI from '@utils/fetchAPI'

import EntryItem from '../../pages/Clothes/components/EntryItem'
import CheckoutConfirmationModal from './components/CheckoutConfirmationModal'

function SessionCartModal({
  isOpen,
  onClose,
  cartItems,
  refreshEntries
}: {
  isOpen: boolean
  onClose: () => void
  cartItems: IVirtualWardrobeEntry[]

  refreshEntries: () => void
}) {
  const queryClient = useQueryClient()
  const [checkoutConfirmationModalOpen, setCheckoutConfirmationModalOpen] =
    useState(false)

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
      refreshEntries()
    } catch {
      toast.error('Failed to remove item from cart')
    }
  }

  async function handleCheckout(notes: string) {
    try {
      await fetchAPI('virtual-wardrobe/session/checkout', {
        method: 'POST',
        body: {
          notes
        }
      })

      queryClient.setQueryData<IVirtualWardrobeEntry[]>(
        ['virtual-wardrobe', 'session-cart-items'],
        []
      )
      refreshEntries()
      onClose()
    } catch {
      toast.error('Failed to checkout')
    }
  }

  return (
    <>
      <ModalWrapper isOpen={isOpen} minWidth="50vw">
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
              onClick={() => {
                setCheckoutConfirmationModalOpen(true)
              }}
            >
              Checkout
            </Button>
          </>
        )}
      </ModalWrapper>
      <CheckoutConfirmationModal
        isOpen={checkoutConfirmationModalOpen}
        onClose={() => {
          setCheckoutConfirmationModalOpen(false)
        }}
        onConfirm={handleCheckout}
      />
    </>
  )
}

export default SessionCartModal
