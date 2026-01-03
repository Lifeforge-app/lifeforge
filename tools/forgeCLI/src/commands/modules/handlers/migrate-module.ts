import fs from 'fs'
import kebabCase from 'lodash/kebabCase'
import path from 'path'

import { executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

import {
  getGithubUser,
  validateMaintainerAccess
} from '../../../utils/github-cli'
import { checkAuth } from '../../../utils/registry'
import { generateModuleRegistries } from '../functions/registry/generator'

interface PackageJson {
  name?: string
  version?: string
  exports?: Record<string, string | { types?: string; default?: string }>
  [key: string]: unknown
}

function toNewFolderName(oldName: string, username?: string): string {
  // codeTime -> lifeforge--code-time (kebab-case)
  // or with username: invoiceMaker -> melvinchia3636--invoice-maker
  const normalized = kebabCase(oldName)

  if (username) {
    return `${username}--${normalized}`
  }

  if (normalized.startsWith('lifeforge-')) {
    // Already has lifeforge prefix, just add the extra dash
    return normalized.replace('lifeforge-', 'lifeforge--')
  }

  return `lifeforge--${normalized}`
}

function toPackageName(folderName: string): string {
  // lifeforge--code-time -> @lifeforge/lifeforge--code-time
  // melvinchia3636--invoice-maker -> @lifeforge/melvinchia3636--invoice-maker
  return `@lifeforge/${folderName}`
}

function getUnmigratedModules(): string[] {
  const appsDir = path.join(process.cwd(), 'apps')

  if (!fs.existsSync(appsDir)) {
    return []
  }

  const entries = fs.readdirSync(appsDir, { withFileTypes: true })

  return entries
    .filter(entry => entry.isDirectory())
    .filter(entry => !entry.name.includes('--'))
    .filter(entry => !entry.name.startsWith('.'))
    .map(entry => entry.name)
}

async function migrateSingleModule(
  moduleName: string,
  username?: string,
  skipGenHandler = false
): Promise<boolean> {
  const appsDir = path.join(process.cwd(), 'apps')

  const oldPath = path.join(appsDir, moduleName)

  // Check if module exists
  if (!fs.existsSync(oldPath)) {
    CLILoggingService.warn(`Module "${moduleName}" not found in apps/`)

    return false
  }

  // Check if already migrated
  if (moduleName.startsWith('lifeforge--')) {
    CLILoggingService.debug(`Module "${moduleName}" already migrated, skipping`)

    return false
  }

  const newFolderName = toNewFolderName(moduleName, username)

  const newPath = path.join(appsDir, newFolderName)

  const packageName = toPackageName(newFolderName)

  CLILoggingService.step(`Migrating "${moduleName}" → "${newFolderName}"`)

  try {
    // Step 1: Rename folder
    if (fs.existsSync(newPath)) {
      CLILoggingService.warn(
        `Target folder "${newFolderName}" already exists, skipping`
      )

      return false
    }

    fs.renameSync(oldPath, newPath)

    // Step 2: Remove .git submodule reference
    const gitPath = path.join(newPath, '.git')

    if (fs.existsSync(gitPath)) {
      const gitStat = fs.statSync(gitPath)

      if (gitStat.isFile()) {
        fs.unlinkSync(gitPath)
      } else {
        fs.rmSync(gitPath, { recursive: true, force: true })
      }
    }

    // Step 3: Update package.json
    const packageJsonPath = path.join(newPath, 'package.json')

    const packageJson: PackageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, 'utf-8')
    )

    packageJson.name = packageName

    if (packageJson.version && !packageJson.version.match(/^\d+\.\d+\.\d+/)) {
      packageJson.version = '0.1.0'
    }

    // Populate author if missing
    if (!packageJson.author) {
      CLILoggingService.progress(
        'Fetching GitHub user details for author field...'
      )

      const user = getGithubUser()

      if (user) {
        packageJson.author = `${user.name} <${user.email}>`
        CLILoggingService.success(`Set author to: ${packageJson.author}`)
      } else {
        CLILoggingService.warn(
          'Could not fetch GitHub user details for author field'
        )
      }
    }

    const hasServerIndex = fs.existsSync(
      path.join(newPath, 'server', 'index.ts')
    )

    const hasSchema = fs.existsSync(path.join(newPath, 'server', 'schema.ts'))

    packageJson.exports = {
      ...(hasServerIndex && { './server': './server/index.ts' }),
      './manifest': './manifest.ts',
      ...(hasSchema && { './server/schema': './server/schema.ts' })
    }

    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n'
    )

    // Step 4: Add to root package.json
    const rootPackageJsonPath = path.join(process.cwd(), 'package.json')

    const rootPackageJson = JSON.parse(
      fs.readFileSync(rootPackageJsonPath, 'utf-8')
    )

    if (!rootPackageJson.dependencies) {
      rootPackageJson.dependencies = {}
    }

    rootPackageJson.dependencies[packageName] = 'workspace:*'

    fs.writeFileSync(
      rootPackageJsonPath,
      JSON.stringify(rootPackageJson, null, 2) + '\n'
    )

    CLILoggingService.success(`Migrated "${moduleName}" → "${packageName}"`)

    // Only run bun install and gen if not batching
    if (!skipGenHandler) {
      executeCommand('bun install', {
        cwd: process.cwd(),
        stdio: 'inherit'
      })

      generateModuleRegistries()
    }

    return true
  } catch (error) {
    CLILoggingService.error(`Failed to migrate "${moduleName}": ${error}`)

    return false
  }
}

export async function migrateModuleHandler(
  folderName?: string,
  options?: { official?: boolean }
): Promise<void> {
  // Check authentication first
  CLILoggingService.progress('Checking registry authentication...')

  const auth = await checkAuth()

  if (!auth.authenticated || !auth.username) {
    CLILoggingService.actionableError(
      'Authentication required to migrate modules',
      'Run: bun forge modules login'
    )
    process.exit(1)
  }

  CLILoggingService.success(`Authenticated as ${auth.username}`)

  let username = auth.username

  if (options?.official) {
    const isMaintainer = validateMaintainerAccess(auth.username)

    if (!isMaintainer) {
      CLILoggingService.actionableError(
        'Maintainer access required',
        'You must have maintainer access to lifeforge-app/lifeforge to migrate as official module'
      )
      process.exit(1)
    }

    username = 'lifeforge' // Use lifeforge as the "username" prefix for official modules
  }

  // If no folder specified, migrate all unmigrated modules
  if (!folderName) {
    const unmigrated = getUnmigratedModules()

    if (unmigrated.length === 0) {
      CLILoggingService.info('No unmigrated modules found in apps/')

      return
    }

    CLILoggingService.step(`Found ${unmigrated.length} unmigrated module(s):`)
    unmigrated.forEach(mod => CLILoggingService.info(`  - ${mod}`))

    let migratedCount = 0

    for (const mod of unmigrated) {
      const success = await migrateSingleModule(mod, username, true)

      if (success) {
        migratedCount++
      }
    }

    // Run bun install and gen once at the end
    if (migratedCount > 0) {
      CLILoggingService.progress('Linking workspaces...')

      executeCommand('bun install', {
        cwd: process.cwd(),
        stdio: 'inherit'
      })

      CLILoggingService.progress('Generating registries...')
      generateModuleRegistries()

      CLILoggingService.success(`Migrated ${migratedCount} module(s)`)
    }

    return
  }

  // Normalize folder name (remove apps/ prefix if present)
  const moduleName = folderName.replace(/^apps\//, '')

  await migrateSingleModule(moduleName, username)
}
