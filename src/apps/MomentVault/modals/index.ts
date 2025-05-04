import { ModalComponent } from '../../../core/modals/useModalStore'
import AddEntryModal from './AddEntryModal'
import ModifyTextEntryModal from './ModifyTextEntryModal'

export const MomentVaultModals: Record<string, ModalComponent> = {
  'momentVault.addEntry': AddEntryModal,
  'momentVault.modifyTextEntry': ModifyTextEntryModal
}
