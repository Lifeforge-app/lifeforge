import fs from 'fs'
import path from 'path'

import executeCommand from '@/utils/commands'
import Logging from '@/utils/logging'
import normalizePackage from '@/utils/normalizePackage'

import listModules from '../functions/listModules'

/**
 * Builds module client bundles for federation.
 *
 * For each module with a client/vite.config.ts:
 * 1. Runs `bun run build:client` to generate the federated bundle
 *
 * This creates the remoteEntry.js and assets needed for module federation.
 */
export async function buildModuleHandler(moduleName?: string): Promise<void> {
  const modules = listModules()

  const moduleNames = moduleName
    ? [normalizePackage(moduleName).fullName]
    : Object.keys(modules)

  let builtCount = 0
  let skippedCount = 0

  for (const mod of moduleNames) {
    const { targetDir, shortName } = normalizePackage(mod)

    const viteConfigPath = path.join(targetDir, 'client', 'vite.config.ts')

    if (!fs.existsSync(viteConfigPath)) {
      Logging.debug(`Skipping ${shortName} (no client/vite.config.ts)`)
      skippedCount++
      continue
    }

    Logging.info(`Building ${Logging.highlight(shortName)}...`)

    try {
      executeCommand('bun run build:client', {
        cwd: targetDir,
        stdio: 'pipe'
      })
      builtCount++
    } catch (error) {
      Logging.error(`Failed to build ${shortName}: ${error}`)
    }
  }

  if (builtCount > 0) {
    Logging.success(
      `Built ${Logging.highlight(String(builtCount))} module${builtCount > 1 ? 's' : ''}`
    )
  }

  if (skippedCount > 0 && !moduleName) {
    Logging.info(`Skipped ${skippedCount} modules without client builds`)
  }
}
