import React from 'react'

import { ModuleHeader, ModuleWrapper } from '@lifeforge/ui'

import AvatarColumn from './components/AvatarColumn'
import OrdinaryColumn from './components/OrdinaryColumn'
import PasswordColumn from './components/PasswordColumn'

function Account(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader title="Account Settings" />
      <div className="my-8">
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
      </div>
    </ModuleWrapper>
  )
}

export default Account
