import { ModuleHeader } from 'lifeforge-ui'

import AvatarColumn from './components/AvatarColumn'
import OrdinaryColumn from './components/OrdinaryColumn'
import PasswordColumn from './components/PasswordColumn'
import QRLoginColumn from './components/QRLoginColumn'
import TwoFAColumn from './components/TwoFAColumn'

function AccountSettings() {
  return (
    <>
      <ModuleHeader />
      <div className="mb-8 space-y-3">
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
        <QRLoginColumn />
      </div>
    </>
  )
}

export default AccountSettings
