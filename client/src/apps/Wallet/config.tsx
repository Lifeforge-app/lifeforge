import {
  IconArrowsExchange,
  IconBook,
  IconCurrencyDollar,
  IconDashboard,
  IconFileText,
  IconMapPin,
  IconWallet
} from '@tabler/icons-react'
import { lazy } from 'react'

import type { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Wallet',
  icon: <IconCurrencyDollar />,
  hasAI: true,
  subsection: [
    { label: 'Dashboard', icon: <IconDashboard />, path: '' },
    {
      label: 'Transactions',
      icon: <IconArrowsExchange />,
      path: 'transactions'
    },
    { label: 'Assets', icon: <IconWallet />, path: 'assets' },
    { label: 'Ledgers', icon: <IconBook />, path: 'ledgers' },
    {
      label: 'Spending Heatmap',
      icon: <IconMapPin />,
      path: 'spending-heatmap'
    },
    {
      label: 'Financial Statements',
      icon: <IconFileText />,
      path: 'statements'
    }
  ],
  routes: {
    wallet: lazy(() => import('./pages/Dashboard')),
    'wallet/transactions': lazy(() => import('./pages/Transactions')),
    'wallet/assets': lazy(() => import('./pages/Assets')),
    'wallet/ledgers': lazy(() => import('./pages/Ledgers')),
    'wallet/spending-heatmap': lazy(() => import('./pages/SpendingHeatmap')),
    'wallet/statements': lazy(() => import('./pages/Statements'))
  },
  togglable: true
} satisfies ModuleConfig
