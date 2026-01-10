import type { ModuleCategory } from 'shared'

import accountSettings from '@/core/accountSettings/manifest'
import apiKeys from '@/core/apiKeys/manifest'
import backups from '@/core/backups/manifest'
import dashboard from '@/core/dashboard/manifest'
import documentation from '@/core/documentation/manifest'
import modules from '@/core/moduleManager/manifest'
import personalization from '@/core/personalization/manifest'

export default function loadCoreModules(): ModuleCategory['items'][number][] {
  return [
    accountSettings,
    apiKeys,
    backups,
    dashboard,
    documentation,
    modules,
    personalization
  ]
}
