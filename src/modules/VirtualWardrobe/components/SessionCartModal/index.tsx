import React, { useState } from 'react'
import { Button } from '@components/buttons'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import { Loadable } from '@interfaces/common'
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
  cartItems: Loadable<IVirtualWardrobeEntry[]>
  setCartItems: React.Dispatch<
    React.SetStateAction<Loadable<IVirtualWardrobeEntry[]>>
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
