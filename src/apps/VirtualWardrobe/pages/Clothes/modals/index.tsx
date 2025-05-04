import { ModalComponent } from '../../../../../core/modals/useModalStore'
import ModifyItemModal from './ModifyItemModal'
import SessionCartModal from './SessionCartModal'

export const virtualWardrobeClothesModals: Record<string, ModalComponent> = {
  'virtualWardrobe.clothes.modifyItem': ModifyItemModal,
  'virtualWardrobe.clothes.sessionCart': SessionCartModal
}
