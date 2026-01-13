import { ROOT_DIR } from '@constants'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import z from 'zod'

import { forgeController } from '@functions/routes'
import { checkModulesAvailability as cma } from '@functions/utils/checkModulesAvailability'

import scanFederatedModules, {
  ModuleManifestEntry
} from '../utils/scanFederatedModules'

const APPS_DIR = path.join(ROOT_DIR, 'apps')

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
  .callback(async ({ core: { tempFile } }) => {
    const modules: (ModuleManifestEntry & { isDevMode?: boolean })[] = []

    const devModeModules =
      (new tempFile('module_dev_mode.json', 'array').read() as string[]) || []

    scanFederatedModules(APPS_DIR, modules, false, '/modules')

    const internalAppsDir = path.join(ROOT_DIR, 'client', 'src', 'apps')

    scanFederatedModules(internalAppsDir, modules, true, '/internal-modules')

    const isDev = process.env.NODE_ENV !== 'production'

    if (isDev) {
      for (const mod of modules) {
        if (devModeModules.includes(`@lifeforge/${mod.name}`)) {
          mod.isDevMode = true
        }
      }
    }

    return { modules }
  })

export interface InstalledModule {
  name: string
  displayName: string
  version: string
  description: string
  author: string
  icon: string
  category: string
  isInternal: boolean
  isDevMode?: boolean
}

export const list = forgeController
  .query()
  .description({
    en: 'List installed modules with metadata',
    ms: 'Senaraikan modul yang dipasang dengan metadata',
    'zh-CN': '列出已安装的模块及其元数据',
    'zh-TW': '列出已安裝的模組及其元資料'
  })
  .input({})
  .callback(async ({ core: { tempFile } }) => {
    const modules: InstalledModule[] = []

    if (!fs.existsSync(APPS_DIR)) return { modules }

    const devModeModules =
      (new tempFile('module_dev_mode.json', 'array').read() as string[]) || []

    const dirs = fs
      .readdirSync(APPS_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.'))

    for (const dir of dirs) {
      const pkgPath = path.join(APPS_DIR, dir.name, 'package.json')

      if (!fs.existsSync(pkgPath)) continue

      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

        modules.push({
          name: pkg.name,
          displayName: pkg.displayName || pkg.name,
          version: pkg.version || '0.0.0',
          description: pkg.description || '',
          author: pkg.author || '',
          icon: pkg.lifeforge?.icon || 'tabler:package',
          category: pkg.lifeforge?.category || 'Miscellaneous',
          isInternal: false,
          isDevMode: devModeModules.includes(pkg.name)
        })
      } catch {
        // Skip invalid packages
      }
    }

    return { modules }
  })

export const uninstall = forgeController
  .mutation()
  .description({
    en: 'Uninstall a module',
    ms: 'Nyahpasang modul',
    'zh-CN': '卸载模块',
    'zh-TW': '解除安裝模組'
  })
  .input({
    body: z.object({
      moduleName: z.string().min(1)
    })
  })
  .callback(async ({ body: { moduleName } }) => {
    try {
      execSync(`bun forge modules uninstall ${moduleName}`, {
        cwd: ROOT_DIR,
        stdio: 'pipe'
      })

      return { success: true }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Uninstall failed'

      return { success: false, error: message }
    }
  })
