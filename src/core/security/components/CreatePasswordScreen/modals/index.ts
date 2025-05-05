import { type ModalComponent } from '@lifeforge/ui'

import CreatePasswordConfirmationModal from './CreatePasswordConfirmationModal'

export const CreatePasswordModals: Record<string, ModalComponent> = {
  'createPassword.confirm': CreatePasswordConfirmationModal
}
