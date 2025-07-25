import { lazy } from 'react'
import { Navigate } from 'react-router'

import type { ModuleConfig } from '../../core/routes/interfaces/routes_interfaces'

export default {
  name: 'Virtual Wardrobe',
  icon: 'tabler:shirt',
  subsection: [
    {
      name: 'Virtual Wardrobe Clothes',
      icon: 'tabler:shirt',
      path: 'clothes'
    },
    {
      name: 'Virtual Wardrobe Outfits',
      icon: 'tabler:layout',
      path: 'outfits'
    }
  ],
  routes: {
    'virtual-wardrobe': () => <Navigate to="/virtual-wardrobe/clothes" />,
    'virtual-wardrobe/clothes': lazy(() => import('./pages/Clothes')),
    'virtual-wardrobe/outfits': lazy(() => import('./pages/Outfits'))
  },
  togglable: true
} satisfies ModuleConfig
