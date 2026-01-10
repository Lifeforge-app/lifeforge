import path from 'path'
import z from 'zod'

import { forgeController } from '@functions/routes'
import { checkModulesAvailability as cma } from '@functions/utils/checkModulesAvailability'

import scanFederatedModules, {
  ModuleManifestEntry
} from '../utils/scanFederatedModules'

export const checkModuleAvailability = forgeController
  .query()
  .description({
    en: 'Check if a module is available',
    ms: 'Periksa jika modul tersedia',
    'zh-CN': '检查模块是否可用',
    'zh-TW': '檢查模組是否可用'
  })
  .input({
    query: z.object({
      moduleId: z.string().min(1)
    })
  })
  .callback(async ({ query: { moduleId } }) => cma(moduleId))

export const manifest = forgeController
  .query()
  .description({
    en: 'Get installed modules manifest for runtime loading',
    ms: 'Dapatkan manifes modul yang dipasang',
    'zh-CN': '获取已安装模块的运行时加载清单',
    'zh-TW': '獲取已安裝模組的運行時加載清單'
  })
  .input({})
  .callback(async () => {
    const rootDir = import.meta.dirname.split('/server')[0]

    const modules: ModuleManifestEntry[] = []

    // Scan installable federated modules in /apps
    const appsDir = path.join(rootDir, 'apps')

    scanFederatedModules(appsDir, modules, false, '/modules')

    // Scan internal modules in /client/src/apps
    const internalAppsDir = path.join(rootDir, 'client', 'src', 'apps')

    scanFederatedModules(internalAppsDir, modules, true, '/internal-modules')

    return { modules }
  })
