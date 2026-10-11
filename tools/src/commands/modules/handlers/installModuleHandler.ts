import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

import executeCommand from '@/utils/commands'
import initGitRepository from '@/utils/initGitRepository'
import { installFromGithub } from '@/utils/installSource'
import logger from '@/utils/logger'
import { setLocked, verifyLocked } from '@/utils/moduleLock'
import normalizePackage from '@/utils/normalizePackage'
import { resolveEntry } from '@/utils/registryIndex'

import cleanModuleSource from '../functions/cleanModuleSource'
import { buildModuleHandler } from './buildModuleHandler'

interface InstallOptions {
  dev?: boolean
}

interface InstalledModule {
  id: string
  version: string
  repo: string
  commitSha: string
}

/**
 * Installs one or more modules from the LifeForge registry (a GitHub-hosted index).
 *
 * For each module:
 * 1. Validates it doesn't already exist locally
 * 2. Resolves it in the registry index
 * 3. Downloads the GitHub archive at the pinned release commit
 * 4. Verifies identity, links it, and (optionally) initializes git
 *
 * After installation:
 * - Builds module client bundles for federation (both modes)
 * - Pushes the database schema if a schema exists
 * - Removes source (unless --dev) and records the lockfile entry
 */
export async function installModuleHandler(
  moduleNames: string[],
  options?: InstallOptions
): Promise<void> {
  const isDevMode = options?.dev ?? false

  const installed: InstalledModule[] = []

  for (const moduleName of moduleNames) {
    const { fullName, shortName, targetDir } = normalizePackage(moduleName)

    if (!/^@lifeforge\/[a-z0-9-_]+--[a-z0-9-_]+$/i.test(fullName)) {
      logger.error(
        `Invalid module name: ${chalk.blue(moduleName)}. Module names can only contain letters, numbers, hyphens, and underscores.`
      )
      continue
    }

    if (fs.existsSync(targetDir)) {
      logger.error(`Module already exists at modules/${shortName}`)
      continue
    }

    const entry = await resolveEntry('modules', shortName)

    if (!entry) {
      logger.error(
        `Module ${chalk.blue(shortName)} was not found in the registry`
      )
      continue
    }

    const version = entry.latest
    const commitSha = entry.versions[version]

    if (!commitSha) {
      logger.error(
        `Registry has no release commit for ${chalk.blue(shortName)}@${version}`
      )
      continue
    }

    verifyLocked('modules', shortName, version, commitSha)

    logger.debug(
      `Installing ${chalk.blue(fullName)} v${version} from ${entry.repo}...`
    )

    try {
      await installFromGithub({
        kind: 'modules',
        id: shortName,
        entry,
        targetDir,
        version
      })

      if (isDevMode) {
        initGitRepository(targetDir)
      }

      installed.push({ id: shortName, version, repo: entry.repo, commitSha })

      logger.success(`Installed ${chalk.blue(fullName)} v${version}`)
    } catch (error) {
      logger.error(`Failed to install ${chalk.blue(fullName)}`)
      logger.debug(`Error details: ${error}`)
    }
  }

  if (installed.length === 0) {
    return
  }

  // Build module client bundles for federation (both modes)
  for (const { id } of installed) {
    logger.debug(`Building ${chalk.blue(id)} bundles...`)

    await buildModuleHandler(id)

    await buildModuleHandler(id, { docker: true, buildServer: false })
  }

  // Push database schema for new modules if schema exists
  for (const { id } of installed) {
    const { targetDir } = normalizePackage(id)

    if (fs.existsSync(path.join(targetDir, 'server', 'schema.drizzle.ts'))) {
      logger.debug(`Pushing database schema for ${id}...`)
      executeCommand('pnpm --filter @lifeforge/server db:push')
      break
    }
  }

  // Clean source code if not in dev mode
  if (!isDevMode) {
    logger.debug('Cleaning source code (production mode)...')

    for (const { id } of installed) {
      cleanModuleSource(normalizePackage(id).targetDir)
    }

    logger.info('Source code removed. Only built bundles retained.')
  }

  for (const { id, version, repo, commitSha } of installed) {
    setLocked('modules', id, { repo, version, commitSha })
  }
}
