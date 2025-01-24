import React, { useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import ModalHeader from '@components/Modals/ModalHeader'
import ModalWrapper from '@components/Modals/ModalWrapper'
import APIFallbackComponent from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import { type IVirtualWardrobeEntry } from '@interfaces/virtual_wardrobe_interfaces'
import APIRequest from '@utils/fetchData'
import CheckoutConfirmationModal from './components/CheckoutConfirmationModal'
import EntryItem from '../../pages/Clothes/components/EntryItem'

function SessionCartModal({
  isOpen,
  onClose,
  cartItems,
  setCartItems,
  refreshEntries
}: {
  isOpen: boolean
  onClose: () => void
  cartItems: IVirtualWardrobeEntry[] | 'loading' | 'error'
  setCartItems: React.Dispatch<
    React.SetStateAction<IVirtualWardrobeEntry[] | 'loading' | 'error'>
  >
  refreshEntries: () => void
}): React.ReactElement {
  const [checkoutConfirmationModalOpen, setCheckoutConfirmationModalOpen] =
    useState(false)

  async function handleRemoveFromCart(entryId: string): Promise<void> {
    await APIRequest({
      endpoint: `virtual-wardrobe/session/${entryId}`,
      method: 'DELETE',
      successInfo: 'remove',
      failureInfo: 'remove',
      callback: () => {
        setCartItems(prev => {
          if (typeof prev === 'string') return prev
          return prev.filter(entry => entry.id !== entryId)
        })
        refreshEntries()
      }
    })
  }

  async function handleCheckout(notes: string): Promise<void> {
    await APIRequest({
      endpoint: 'virtual-wardrobe/session/checkout',
      method: 'POST',
      body: {
        notes
      },
      successInfo: 'checkout',
      failureInfo: 'checkout',
      callback: () => {
        setCartItems([])
        refreshEntries()
        onClose()
      }
    })
  }

  return (
    <>
      <ModalWrapper isOpen={isOpen} minWidth="50vw">
        <ModalHeader
          icon="tabler:shopping-bag"
          title="Session Cart"
          onClose={onClose}
        />
        <APIFallbackComponent data={cartItems}>
          {cartItems =>
            cartItems.length === 0 ? (
              <EmptyStateScreen
                title="Session Cart is empty"
                smaller
                description="Add items to the cart by clicking the 'Add to Cart' button on the item"
                icon="tabler:icons-off"
              />
            ) : (
              <>
                <ul className="space-y-4">
                  {cartItems.map(entry => (
                    <EntryItem
                      isCartItem
                      key={entry.id}
                      entry={entry}
                      onRemoveFromCart={async () => {
                        await handleRemoveFromCart(entry.id)
                      }}
                    />
                  ))}
                </ul>

                <Button
                  icon="tabler:arrow-right"
                  iconAtEnd
                  className="mt-6 w-full"
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
