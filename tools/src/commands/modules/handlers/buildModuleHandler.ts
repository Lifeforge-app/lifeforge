import { log } from '@clack/prompts'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

import executeCommand from '@/utils/commands'
import { withSpinner } from '@/utils/spinner'

import listModules, {
  type ModuleBasicInfo,
  resolveModule
} from '../functions/listModules'

interface BuildOptions {
  docker?: boolean
  buildClient?: boolean
  buildServer?: boolean
}

/**
 * Builds module client and server bundles.
 *
 * For each module:
 * - If client/vite.config.ts exists: Runs `pnpm run build:client`
 * - If server/index.ts exists: Runs `pnpm run build:server`
 *
 * @param moduleName - Optional module id to build (builds all if omitted)
 * @param options.docker - If true, builds for Docker (outputs to dist-docker with /api base)
 */
export async function buildModuleHandler(
  moduleName?: string,
  options?: BuildOptions
): Promise<void> {
  const isDocker = options?.docker ?? false

  const buildClient = options?.buildClient ?? true

  const buildServer = options?.buildServer ?? true

  let targets: ModuleBasicInfo[]

  if (moduleName) {
    const mod = resolveModule(moduleName)

    if (!mod) {
      log.error(`Module ${chalk.blue(moduleName)} is not installed`)

      return
    }

    targets = [mod]
  } else {
    targets = Object.values(listModules())
  }

  let clientBuiltCount = 0
  let serverBuiltCount = 0
  let skippedCount = 0

  if (isDocker) {
    log.step('Building for Docker (output: dist-docker, base: /api)')
  }

  for (const { id: shortName, dir: targetDir } of targets) {
    // Check if module folder exists
    if (!fs.existsSync(targetDir)) {
      log.error(`Module ${chalk.blue(shortName)} not found at ${targetDir}`)
      continue
    }

    const viteConfigPath = path.join(targetDir, 'client', 'vite.config.ts')

    const serverIndexPath = path.join(targetDir, 'server', 'index.ts')

    const hasClient = fs.existsSync(viteConfigPath)

    const hasServer = fs.existsSync(serverIndexPath)

    if (!hasClient && !hasServer) {
      skippedCount++
      continue
    }

    // Build client
    if (hasClient && buildClient) {
      if (!isDocker && !process.env.VITE_API_HOST) {
        log.warn(`VITE_API_HOST not set. Skipping local build.`)
      } else {
        try {
          await withSpinner(
            `Building ${chalk.blue(shortName)} client...`,
            () =>
              executeCommand('pnpm run build:client', {
                cwd: targetDir,
                env: isDocker
                  ? { ...process.env, DOCKER_BUILD: 'true' }
                  : undefined
              }),
            {
              success: `Built ${chalk.blue(shortName)} client`,
              fail: `Failed to build ${chalk.blue(shortName)} client`
            }
          )
          clientBuiltCount++
        } catch {
          // Already reported by the spinner
        }
      }
    }

    // Build server
    if (hasServer && buildServer) {
      try {
        await withSpinner(
          `Building ${chalk.blue(shortName)} server...`,
          () => executeCommand('pnpm run build:server', { cwd: targetDir }),
          {
            success: `Built ${chalk.blue(shortName)} server`,
            fail: `Failed to build ${chalk.blue(shortName)} server`
          }
        )
        serverBuiltCount++
      } catch {
        // Already reported by the spinner
      }
    }
  }

  if (clientBuiltCount > 0 || serverBuiltCount > 0) {
    log.success(
      `Built ${chalk.blue(String(clientBuiltCount))} client bundle${clientBuiltCount !== 1 ? 's' : ''}, ${chalk.blue(String(serverBuiltCount))} server bundle${serverBuiltCount !== 1 ? 's' : ''}`
    )
  }

  if (skippedCount > 0 && !moduleName) {
    log.step(`Skipped ${skippedCount} modules without builds`)
  }
}
