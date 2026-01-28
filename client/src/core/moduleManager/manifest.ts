import { lazy } from 'react'
import type { ModuleCategory } from 'shared'

export default {
  routes: {
    '/modules': lazy(() => import('./pages/Modules')),
    '/categories': lazy(() => import('./pages/Categories'))
  },
  subsection: [
    {
      label: 'Modules',
      icon: 'tabler:puzzle',
      path: '/modules'
    },
    {
      label: 'Categories',
      icon: 'tabler:category',
      path: '/categories'
    }
  ],
  name: 'module-manager',
  displayName: 'Module Manager',
  version: '1.0.0',
  author: 'LifeForge <https://lifeforge.dev>',
  description: 'UI-based module manager for your LifeForge instance',
  icon: 'tabler:puzzle',
  category: 'Settings',
  APIKeyAccess: {}
} as ModuleCategory['items'][number]
