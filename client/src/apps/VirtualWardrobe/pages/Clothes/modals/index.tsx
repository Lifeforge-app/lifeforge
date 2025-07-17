import { type ModalComponent } from 'lifeforge-ui'

import CheckoutConfirmationModal from './CheckoutConfirmationModal'
import ModifyItemModal from './ModifyItemModal'
import SessionCartModal from './SessionCartModal'

export const virtualWardrobeClothesModals: Record<string, ModalComponent> = {
  'virtualWardrobe.clothes.modifyItem': ModifyItemModal,
  'virtualWardrobe.clothes.sessionCart': SessionCartModal,
  'virtualWardrobe.clothes.checkoutConfirmation': CheckoutConfirmationModal
}
