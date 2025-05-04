import { ModalComponent } from '../../../modals/useModalStore'
import ModifyAPIKeyModal from './ModifyAPIKeyModal'

export const APIKeyModals: Record<string, ModalComponent> = {
  'apiKeys.modifyEntry': ModifyAPIKeyModal
}
