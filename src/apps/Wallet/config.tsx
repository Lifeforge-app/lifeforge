import {
  IconArrowsExchange,
  IconBook,
  IconCurrencyDollar,
  IconDashboard,
  IconFileText,
  IconWallet
} from '@tabler/icons-react'
import { lazy } from 'react'

import { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Wallet',
  icon: <IconCurrencyDollar />,
  hasAI: true,
  subsection: [
    { name: 'Dashboard', icon: <IconDashboard />, path: '' },
    {
      name: 'Transactions',
      icon: <IconArrowsExchange />,
      path: 'transactions'
    },
    { name: 'Assets', icon: <IconWallet />, path: 'assets' },
    { name: 'Ledgers', icon: <IconBook />, path: 'ledgers' },
    {
      name: 'Financial Statements',
      icon: <IconFileText />,
      path: 'statements'
    }
  ],
  routes: {
    wallet: lazy(() => import('./pages/Dashboard')),
    'wallet/transactions': lazy(() => import('./pages/Transactions')),
    'wallet/assets': lazy(() => import('./pages/Assets')),
    'wallet/ledgers': lazy(() => import('./pages/Ledgers')),
    'wallet/statements': lazy(() => import('./pages/Statements'))
  },
  togglable: true
} satisfies ModuleConfig
