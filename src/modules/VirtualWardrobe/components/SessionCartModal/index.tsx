import { useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import { Loadable } from '@interfaces/common'
import { type IVirtualWardrobeEntry } from '@interfaces/virtual_wardrobe_interfaces'
import fetchAPI from '@utils/fetchAPI'
import CheckoutConfirmationModal from './components/CheckoutConfirmationModal'
import EntryItem from '../../pages/Clothes/components/EntryItem'

function SessionCartModal({
  isOpen,
  onClose,
  cartItems,
  refreshEntries
}: {
  isOpen: boolean
  onClose: () => void
  cartItems: Loadable<IVirtualWardrobeEntry[]>

  refreshEntries: () => void
}): React.ReactElement {
  const queryClient = useQueryClient()
  const [checkoutConfirmationModalOpen, setCheckoutConfirmationModalOpen] =
    useState(false)

  async function handleRemoveFromCart(entryId: string): Promise<void> {
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

  async function handleCheckout(notes: string): Promise<void> {
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
          namespace="modules.virtualWardrobe"
          title="Session Cart"
          onClose={onClose}
        />
        <APIFallbackComponent data={cartItems}>
          {cartItems =>
            cartItems.length === 0 ? (
              <EmptyStateScreen
                smaller
                icon="tabler:icons-off"
                name="sessionCart"
                namespace="modules.virtualWardrobe"
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
                  onClick={() => {
                    setCheckoutConfirmationModalOpen(true)
                  }}
                >
                  Checkout
                </Button>
              </>
            )
          }
        </APIFallbackComponent>
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
