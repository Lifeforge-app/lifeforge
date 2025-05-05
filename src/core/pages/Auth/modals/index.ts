import { type ModalComponent } from '@lifeforge/ui'

import TwoFAModal from './TwoFAModal/TwoFAModal'

export const AuthModals: Record<string, ModalComponent> = {
  'auth.authWith2fa': TwoFAModal
}
