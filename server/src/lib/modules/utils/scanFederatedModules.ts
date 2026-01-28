import fs from 'fs'
import path from 'path'
import { packageJSONSchema } from 'shared'

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
  isDevMode: boolean
}

/**
 * Scans a directory for federated modules
 */
export default function scanFederatedModules(
  baseDir: string,
  modules: ModuleManifestEntry[],
  isInternal: boolean,
  urlPrefix: string,
  devModeModules?: string[]
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

      const distDir =
        process.env.DOCKER_MODE === 'true' ? 'dist-docker' : 'dist'

      const remoteEntryPath = path.join(
        baseDir,
        dir.name,
        'client',
        distDir,
        'assets',
        'remoteEntry.js'
      )

      const hasDist = fs.existsSync(remoteEntryPath)

      const hasSource = fs.existsSync(
        path.join(baseDir, dir.name, 'client/src')
      )

      if (
        !(hasDist || hasSource) ||
        (process.env.NODE_ENV === 'production' && !hasDist)
      )
        continue

      const isDevMode = (() => {
        if (process.env.NODE_ENV === 'production') return false

        if (!hasDist) return true
        if (!hasSource) return false

        return devModeModules?.includes(`@lifeforge/${dir.name}`)
      })()

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
        APIKeyAccess: parsed.data.lifeforge.APIKeyAccess,
        isDevMode: !!isDevMode
      })
    } catch {
      // Skip invalid modules
    }
  }
}
