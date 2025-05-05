import { type ModalComponent } from '@lifeforge/ui'

import ModifyAPIKeyModal from './ModifyAPIKeyModal'

export const APIKeyModals: Record<string, ModalComponent> = {
  'apiKeys.modifyEntry': ModifyAPIKeyModal
}
