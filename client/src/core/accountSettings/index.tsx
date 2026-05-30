import { ModuleHeader, Stack } from '@lifeforge/ui'

import AvatarColumn from './components/AvatarColumn'
import OrdinaryColumn from './components/OrdinaryColumn'
import PasswordColumn from './components/PasswordColumn'
import QRLoginColumn from './components/QRLoginColumn'
import TwoFAColumn from './components/TwoFAColumn'

function AccountSettings() {
  return (
    <>
      <ModuleHeader />
      <Stack mb="xl">
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
      </Stack>
    </>
  )
}

export default AccountSettings
