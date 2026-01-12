import fs from 'fs'
import path from 'path'

import executeCommand from '@/utils/commands'
import Logging from '@/utils/logging'
import normalizePackage from '@/utils/normalizePackage'

import listModules from '../functions/listModules'

/**
 * Builds module client and server bundles.
 *
 * For each module:
 * - If client/vite.config.ts exists: Runs `bun run build:client`
 * - If server/index.ts exists: Runs `bun run build:server`
 */
export async function buildModuleHandler(moduleName?: string): Promise<void> {
  const modules = listModules()

  const moduleNames = moduleName
    ? [normalizePackage(moduleName).fullName]
    : Object.keys(modules)

  let clientBuiltCount = 0
  let serverBuiltCount = 0
  let skippedCount = 0

  for (const mod of moduleNames) {
    const { targetDir, shortName } = normalizePackage(mod)

    // Check if module folder exists
    if (!fs.existsSync(targetDir)) {
      Logging.error(
        `Module ${Logging.highlight(shortName)} not found at ${targetDir}`
      )
      continue
    }

    const viteConfigPath = path.join(targetDir, 'client', 'vite.config.ts')

    const serverIndexPath = path.join(targetDir, 'server', 'index.ts')

    const hasClient = fs.existsSync(viteConfigPath)

    const hasServer = fs.existsSync(serverIndexPath)

    if (!hasClient && !hasServer) {
      Logging.debug(`Skipping ${shortName} (no client or server)`)
      skippedCount++
      continue
    }

    // Build client
    if (hasClient) {
      Logging.info(`Building ${Logging.highlight(shortName)} client...`)

      try {
        executeCommand('bun run build:client', {
          cwd: targetDir,
          stdio: 'pipe'
        })
        clientBuiltCount++
      } catch (error) {
        Logging.error(`Failed to build ${shortName} client: ${error}`)
      }
    }

    // Build server
    if (hasServer) {
      Logging.info(`Building ${Logging.highlight(shortName)} server...`)

      try {
        executeCommand('bun run build:server', {
          cwd: targetDir,
          stdio: 'pipe'
        })
        serverBuiltCount++
      } catch (error) {
        Logging.error(`Failed to build ${shortName} server: ${error}`)
      }
    }
  }

  if (clientBuiltCount > 0 || serverBuiltCount > 0) {
    Logging.success(
      `Built ${Logging.highlight(String(clientBuiltCount))} client bundle${clientBuiltCount !== 1 ? 's' : ''}, ${Logging.highlight(String(serverBuiltCount))} server bundle${serverBuiltCount !== 1 ? 's' : ''}`
    )
  }

  if (skippedCount > 0 && !moduleName) {
    Logging.info(`Skipped ${skippedCount} modules without builds`)
  }
}
