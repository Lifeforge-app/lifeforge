import { ModuleHeader, Stack } from '@lifeforge/ui'

import { TabbedView } from './tabs'
import AccountAndSecurityTab from './tabs/AccountAndSecurityTab'
import PersonalInfoTab from './tabs/PersonalInfoTab'

function AccountSettings() {
  return (
    <TabbedView.Root>
      <ModuleHeader />
      <TabbedView.Selector />
      <Stack mb="xl" mt="md">
        <TabbedView.When tabId="personal-info">
          <PersonalInfoTab />
        </TabbedView.When>
        <TabbedView.When tabId="account-and-security">
          <AccountAndSecurityTab />
        </TabbedView.When>
      </Stack>
    </TabbedView.Root>
  )
}

export default AccountSettings
