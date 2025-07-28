import { ModuleHeader, ModuleWrapper } from 'lifeforge-ui'

import AvatarColumn from './components/AvatarColumn'
import OrdinaryColumn from './components/OrdinaryColumn'
import PasswordColumn from './components/PasswordColumn'
import TwoFAColumn from './components/TwoFAColumn'

function AccountSettings() {
  return (
    <ModuleWrapper>
      <ModuleHeader title="Account Settings" />
      <div className="mb-8">
        <AvatarColumn />
        <OrdinaryColumn
          icon="tabler:user"
          id="username"
          title="username"
          type="text"
        />
        <OrdinaryColumn
          icon="tabler:user-screen"
          id="name"
          title="display Name"
          type="text"
        />
        <OrdinaryColumn
          icon="tabler:mail"
          id="email"
          title="email"
          type="text"
        />
        <OrdinaryColumn
          icon="tabler:cake"
          id="dateOfBirth"
          title="date Of Birth"
          type="datetime"
        />
        <PasswordColumn />
        <TwoFAColumn />
      </div>
    </ModuleWrapper>
  )
}

export default AccountSettings
