import { ROOT_DIR } from '@constants'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import z from 'zod'

import forge from '../forge'
import scanFederatedModules, {
  type ModuleManifestEntry
} from '../utils/scanFederatedModules'

const APPS_DIR = path.join(ROOT_DIR, 'apps')

export const manifest = forge
  .query()
  .description('Get installed modules manifest for runtime loading')
  .input({})
  .callback(async ({ core: { tempFile } }) => {
    const modules: (ModuleManifestEntry & { isDevMode?: boolean })[] = []

    const devModeModules =
      (new tempFile('module_dev_mode.json', 'array').read() as string[]) || []

    scanFederatedModules(APPS_DIR, modules, false, '/modules', devModeModules)

    const internalAppsDir = path.join(ROOT_DIR, 'client', 'src', 'apps')

    scanFederatedModules(internalAppsDir, modules, true, '/internal-modules')

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
  isDevMode: boolean
  hasDist: boolean
  hasSource: boolean
}

export const list = forge
  .query()
  .description('List installed modules with metadata')
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

        // Check if client dist exists (use dist-docker in Docker mode)
        const distDir =
          process.env.DOCKER_MODE === 'true' ? 'dist-docker' : 'dist'

        const clientDistPath = path.join(
          APPS_DIR,
          dir.name,
          'client',
          distDir,
          'assets',
          'remoteEntry.js'
        )

        const hasDist = fs.existsSync(clientDistPath)

        const hasSource = fs.existsSync(
          path.join(APPS_DIR, dir.name, 'client/src')
        )

        if (
          !(hasSource || hasDist) ||
          (process.env.NODE_ENV === 'production' && !hasDist)
        )
          continue

        modules.push({
          name: pkg.name,
          displayName: pkg.displayName || pkg.name,
          version: pkg.version || '0.0.0',
          description: pkg.description || '',
          author: pkg.author || '',
          icon: pkg.lifeforge?.icon || 'tabler:package',
          category: pkg.lifeforge?.category || 'Miscellaneous',
          isInternal: false,
          isDevMode: (() => {
            if (!hasSource) return false
            if (!hasDist) return true

            return devModeModules.includes(pkg.name)
          })(),
          hasDist,
          hasSource
        })
      } catch {
        // Skip invalid packages
      }
    }

    return modules
  })

export const uninstall = forge
  .mutation()
  .description('Uninstall a module')
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
