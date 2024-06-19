import React from 'react'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import AvatarColumn from './components/AvatarColumn'
import OrdinaryColumn from './components/OrdinaryColumn'
import PasswordColumn from './components/PasswordColumn'

function Account(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader title="Account Settings" desc="..." />
      <AvatarColumn />
      <div className="my-6 w-full border-b-[1.5px] border-bg-200 dark:border-bg-800" />
      <OrdinaryColumn title="username" id="username" icon="tabler:user" />
      <div className="my-6 w-full border-b-[1.5px] border-bg-200 dark:border-bg-800" />
      <OrdinaryColumn title="displayName" id="name" icon="tabler:user-screen" />
      <div className="my-6 w-full border-b-[1.5px] border-bg-200 dark:border-bg-800" />
      <OrdinaryColumn title="email" id="email" icon="tabler:mail" />
      <div className="my-6 w-full border-b-[1.5px] border-bg-200 dark:border-bg-800" />
      <PasswordColumn />
    </ModuleWrapper>
  )
}

export default Account
