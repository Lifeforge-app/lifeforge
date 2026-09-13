import { createTabbedView } from '@lifeforge/ui'

export const TemplatesTabbedView = createTabbedView({
  tabs: [
    {
      name: 'transactionTypes.income',
      id: 'income',
      icon: 'tabler:login-2'
    },
    {
      name: 'transactionTypes.expenses',
      id: 'expenses',
      icon: 'tabler:logout'
    }
  ]
})
