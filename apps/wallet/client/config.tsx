import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Wallet',
  icon: 'tabler:currency-dollar',
  hasAI: true,
  subsection: [
    { label: 'Dashboard', icon: 'tabler:dashboard', path: '' },
    {
      label: 'Transactions',
      icon: 'tabler:arrows-exchange',
      path: 'transactions'
    },
    { label: 'Assets', icon: 'tabler:wallet', path: 'assets' },
    { label: 'Ledgers', icon: 'tabler:book', path: 'ledgers' },
    {
      label: 'Spending Heatmap',
      icon: 'tabler:map-pin',
      path: 'spending-heatmap'
    },
    {
      label: 'Financial Statements',
      icon: 'tabler:file-text',
      path: 'statements'
    }
  ],
  routes: {
    wallet: lazy(() => import('./src/pages/Dashboard')),
    'wallet/transactions': lazy(() => import('./src/pages/Transactions')),
    'wallet/assets': lazy(() => import('./src/pages/Assets')),
    'wallet/ledgers': lazy(() => import('./src/pages/Ledgers')),
    'wallet/spending-heatmap': lazy(
      () => import('./src/pages/SpendingHeatmap')
    ),
    'wallet/statements': lazy(() => import('./src/pages/Statements'))
  },
  togglable: true,
  category: '03.Finance'
} satisfies ModuleConfig
