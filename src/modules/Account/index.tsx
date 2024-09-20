import React from 'react'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import AvatarColumn from './components/AvatarColumn'
import OrdinaryColumn from './components/OrdinaryColumn'
import PasswordColumn from './components/PasswordColumn'

function Account(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader title="Account Settings" />
      <div className="my-8">
        <AvatarColumn />
        <OrdinaryColumn title="username" id="username" icon="tabler:user" />
        <OrdinaryColumn
          title="display Name"
          id="name"
          icon="tabler:user-screen"
        />
        <OrdinaryColumn title="email" id="email" icon="tabler:mail" />
        <OrdinaryColumn
          title="date Of Birth"
          id="dateOfBirth"
          icon="tabler:cake"
          type="date"
        />
        <PasswordColumn />
      </div>
    </ModuleWrapper>
  )
}

export default Account
