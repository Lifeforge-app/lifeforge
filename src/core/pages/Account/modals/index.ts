import { type ModalComponent } from '@lifeforge/ui'

import DisableTwoFAModal from './DisableTwoFAModal'
import EnableTwoFAModal from './EnableTwoFAModal'
import ModifyModal from './ModifyModal'

export const AccountSettingsModals: Record<string, ModalComponent> = {
  'accountSettings.enable2FA': EnableTwoFAModal,
  'accountSettings.disable2FA': DisableTwoFAModal,
  'accountSettings.modify': ModifyModal
}
