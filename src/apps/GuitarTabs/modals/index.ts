import { ModalComponent } from '../../../core/modals/useModalStore'
import GuitarWorldModal from './GuitarWorldModal'
import ModifyEntryModal from './ModifyEntryModal'

export const guitarTabsModals: Record<string, ModalComponent> = {
  'guitarTabs.modifyEntry': ModifyEntryModal,
  'guitarTabs.guitarWorld': GuitarWorldModal
}
