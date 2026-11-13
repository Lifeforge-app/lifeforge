import { log } from '@clack/prompts'
import chalk from 'chalk'
import fs from 'fs'

import {
  resolveModuleSchemaFile,
  syncModuleSchema
} from '@/commands/db/functions/schema'
import initGitRepository from '@/utils/initGitRepository'
import { installFromGithub } from '@/utils/installSource'
import { setLocked, verifyLocked } from '@/utils/moduleLock'
import normalizePackage from '@/utils/normalizePackage'
import { resolveEntry } from '@/utils/registryIndex'
import { failSpinner, startSpinner, stopSpinner } from '@/utils/spinner'

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
    if (!/^[a-z0-9-_]+--[a-z0-9-_]+$/i.test(moduleName)) {
      log.error(
        `Invalid module id: ${chalk.blue(moduleName)}. Pass the package id (e.g. lifeforge--calendar).`
      )
      continue
    }

    const { fullName, shortName, targetDir } = normalizePackage(moduleName)

    if (fs.existsSync(targetDir)) {
      log.error(`Module already exists at modules/${shortName}`)
      continue
    }

    const entry = await resolveEntry('modules', shortName)

    if (!entry) {
      log.error(`Module ${chalk.blue(shortName)} was not found in the registry`)
      continue
    }

    const version = entry.latest
    const commitSha = entry.versions[version]

    if (!commitSha) {
      log.error(
        `Registry has no release commit for ${chalk.blue(shortName)}@${version}`
      )
      continue
    }

    verifyLocked('modules', shortName, version, commitSha)

    startSpinner(`Installing ${chalk.blue(fullName)} v${version}...`)

    try {
      await installFromGithub({
        id: shortName,
        entry,
        targetDir,
        version
      })

      if (isDevMode) {
        initGitRepository(targetDir)
      }

      installed.push({ id: shortName, version, repo: entry.repo, commitSha })

      stopSpinner(`Installed ${chalk.blue(fullName)} v${version}`)
    } catch {
      failSpinner(`Failed to install ${chalk.blue(fullName)}`)
    }
  }

  if (installed.length === 0) {
    return
  }

  // Build module client bundles for federation (both modes)
  for (const { id } of installed) {
    await buildModuleHandler(id)

    await buildModuleHandler(id, { docker: true, buildServer: false })
  }

  // Sync the database schema for new modules (only their own objects)
  for (const { id } of installed) {
    const { targetDir } = normalizePackage(id)

    if (!resolveModuleSchemaFile(targetDir)) {
      continue
    }

    startSpinner(`Syncing database schema for ${chalk.blue(id)}...`)

    try {
      await syncModuleSchema(targetDir)
      stopSpinner(`Synced database schema for ${chalk.blue(id)}`)
    } catch {
      failSpinner(`Could not sync the database schema for ${id} automatically.`)
    }
  }

  // Clean source code if not in dev mode
  if (!isDevMode) {
    for (const { id } of installed) {
      cleanModuleSource(normalizePackage(id).targetDir)
    }

    log.step('Source code removed. Only built bundles retained.')
  }

  for (const { id, version, repo, commitSha } of installed) {
    setLocked('modules', id, { repo, version, commitSha })
  }
}
