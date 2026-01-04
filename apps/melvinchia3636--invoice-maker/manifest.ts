import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  routes: {
    '/': lazy(() => import('@')),
    '/modify/:id?': lazy(() => import('@/pages/ModifyInvoice')),
    '/view/:id': lazy(() => import('@/pages/ViewInvoice'))
  },
} satisfies ModuleConfig
