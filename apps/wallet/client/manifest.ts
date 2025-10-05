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
    wallet: lazy(() => import('@/pages/Dashboard')),
    'wallet/transactions': lazy(() => import('@/pages/Transactions')),
    'wallet/assets': lazy(() => import('@/pages/Assets')),
    'wallet/ledgers': lazy(() => import('@/pages/Ledgers')),
    'wallet/spending-heatmap': lazy(() => import('@/pages/SpendingHeatmap')),
    'wallet/statements': lazy(() => import('@/pages/Statements'))
  },
  category: '03.Finance'
} satisfies ModuleConfig
