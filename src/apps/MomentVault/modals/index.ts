import { type ModalComponent } from '@lifeforge/ui'

import AddEntryModal from './AddEntryModal'
import ModifyTextEntryModal from './ModifyTextEntryModal'

export const MomentVaultModals: Record<string, ModalComponent> = {
  'momentVault.addEntry': AddEntryModal,
  'momentVault.modifyTextEntry': ModifyTextEntryModal
}
