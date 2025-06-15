import { ModuleHeader, ModuleWrapper } from '@lifeforge/ui'
import { useModalsEffect } from '@lifeforge/ui'

import AvatarColumn from './components/AvatarColumn'
import OrdinaryColumn from './components/OrdinaryColumn'
import PasswordColumn from './components/PasswordColumn'
import TwoFAColumn from './components/TwoFAColumn'
import { AccountSettingsModals } from './modals'

function AccountSettings() {
  useModalsEffect(AccountSettingsModals)

  return (
    <ModuleWrapper>
      <ModuleHeader title="Account Settings" />
      <div className="mb-8">
        <AvatarColumn />
        <OrdinaryColumn icon="tabler:user" id="username" title="username" />
        <OrdinaryColumn
          icon="tabler:user-screen"
          id="name"
          title="display Name"
        />
        <OrdinaryColumn icon="tabler:mail" id="email" title="email" />
        <OrdinaryColumn
          icon="tabler:cake"
          id="dateOfBirth"
          title="date Of Birth"
          type="date"
        />
        <PasswordColumn />
        <TwoFAColumn />
      </div>
    </ModuleWrapper>
  )
}

export default AccountSettings
