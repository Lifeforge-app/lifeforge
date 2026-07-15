import { createTabbedView } from '@lifeforge/ui'

export const TabbedView = createTabbedView({
  namespace: 'common.account-settings',
  tabs: [
    {
      id: 'personal-info',
      name: 'common.account-settings:tabs.personalInformation',
      icon: 'tabler:user'
    },
    {
      id: 'account-and-security',
      name: 'common.account-settings:tabs.accountAndSecurity',
      icon: 'tabler:lock'
    }
  ]
})
