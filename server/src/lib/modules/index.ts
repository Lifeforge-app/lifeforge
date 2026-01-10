import fs from 'fs'
import path from 'path'
import { packageJSONSchema } from 'shared'
import z from 'zod'

import { forgeController, forgeRouter } from '@functions/routes'
import { checkModulesAvailability as cma } from '@functions/utils/checkModulesAvailability'

const checkModuleAvailability = forgeController
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

/**
 * Get root directory path
 */
function getRootDir(): string {
  return import.meta.dirname.split('/server')[0]
}

/**
 * Module manifest entry for federated modules
 */
export interface ModuleManifestEntry {
  name: string
  displayName: string
  version: string
  description: string
  author: string
  icon: string
  category: string
  remoteEntryUrl: string
  isInternal: boolean
  APIKeyAccess?: Record<string, { usage: string; required: boolean }>
}

/**
 * Scans a directory for federated modules
 */
function scanFederatedModules(
  baseDir: string,
  modules: ModuleManifestEntry[],
  isInternal: boolean,
  urlPrefix: string
) {
  if (!fs.existsSync(baseDir)) return

  const dirs = fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))

  for (const dir of dirs) {
    const pkgPath = path.join(baseDir, dir.name, 'package.json')

    if (!fs.existsSync(pkgPath)) continue

    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

      const parsed = packageJSONSchema.safeParse(pkg)

      if (!parsed.success) continue

      // Check for remoteEntry.js (built federated module)
      const remoteEntryPath = path.join(
        baseDir,
        dir.name,
        'client',
        'dist',
        'assets',
        'remoteEntry.js'
      )

      if (!fs.existsSync(remoteEntryPath)) continue

      modules.push({
        name: dir.name,
        displayName: parsed.data.displayName,
        version: parsed.data.version,
        description: parsed.data.description,
        author: parsed.data.author,
        icon: parsed.data.lifeforge.icon,
        category: parsed.data.lifeforge.category,
        remoteEntryUrl: `${urlPrefix}/${dir.name}/assets/remoteEntry.js`,
        isInternal,
        APIKeyAccess: parsed.data.lifeforge.APIKeyAccess
      })
    } catch {
      // Skip invalid modules
    }
  }
}

const manifest = forgeController
  .query()
  .noEncryption()
  .description({
    en: 'Get installed modules manifest for runtime loading',
    ms: 'Dapatkan manifes modul yang dipasang',
    'zh-CN': '获取已安装模块的运行时加载清单',
    'zh-TW': '獲取已安裝模組的運行時加載清單'
  })
  .input({})
  .callback(async () => {
    const rootDir = getRootDir()

    const modules: ModuleManifestEntry[] = []

    // Scan installable federated modules in /apps
    const appsDir = path.join(rootDir, 'apps')

    scanFederatedModules(appsDir, modules, false, '/modules')

    // Scan internal modules in /client/src/apps
    const internalAppsDir = path.join(rootDir, 'client', 'src', 'apps')

    scanFederatedModules(internalAppsDir, modules, true, '/internal-modules')

    return { modules }
  })

export default forgeRouter({
  checkModuleAvailability,
  manifest
})
