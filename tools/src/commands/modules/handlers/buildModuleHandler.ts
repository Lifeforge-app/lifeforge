import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

import executeCommand from '@/utils/commands'
import logger from '@/utils/logger'
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
      logger.error(`Module ${chalk.blue(shortName)} not found at ${targetDir}`)
      continue
    }

    const viteConfigPath = path.join(targetDir, 'client', 'vite.config.ts')

    const serverIndexPath = path.join(targetDir, 'server', 'index.ts')

    const hasClient = fs.existsSync(viteConfigPath)

    const hasServer = fs.existsSync(serverIndexPath)

    if (!hasClient && !hasServer) {
      logger.debug(`Skipping ${shortName} (no client or server)`)
      skippedCount++
      continue
    }

    // Build client
    if (hasClient) {
      logger.info(`Building ${chalk.blue(shortName)} client...`)

      try {
        executeCommand('bun run build:client', {
          cwd: targetDir,
          stdio: 'pipe'
        })
        clientBuiltCount++
      } catch (error) {
        logger.error(`Failed to build ${shortName} client: ${error}`)
      }
    }

    // Build server
    if (hasServer) {
      logger.info(`Building ${chalk.blue(shortName)} server...`)

      try {
        executeCommand('bun run build:server', {
          cwd: targetDir,
          stdio: 'pipe'
        })
        serverBuiltCount++
      } catch (error) {
        logger.error(`Failed to build ${shortName} server: ${error}`)
      }
    }
  }

  if (clientBuiltCount > 0 || serverBuiltCount > 0) {
    logger.success(
      `Built ${chalk.blue(String(clientBuiltCount))} client bundle${clientBuiltCount !== 1 ? 's' : ''}, ${chalk.blue(String(serverBuiltCount))} server bundle${serverBuiltCount !== 1 ? 's' : ''}`
    )
  }

  if (skippedCount > 0 && !moduleName) {
    logger.info(`Skipped ${skippedCount} modules without builds`)
  }
}
