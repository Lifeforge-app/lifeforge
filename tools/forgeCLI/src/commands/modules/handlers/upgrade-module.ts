import fs from 'fs'
import path from 'path'

import { confirmAction, executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

import {
  checkAuth,
  getRegistryUrl,
  openRegistryLogin
} from '../../../utils/registry'
import { generateModuleRegistries } from '../functions/registry/generator'

const LIFEFORGE_SCOPE = '@lifeforge/'

interface PackageJson {
  name?: string
  version?: string
  dependencies?: Record<string, string>
  [key: string]: unknown
}

function getInstalledModules(): {
  name: string
  version: string
  folder: string
}[] {
  const rootPackageJsonPath = path.join(process.cwd(), 'package.json')

  const rootPackageJson: PackageJson = JSON.parse(
    fs.readFileSync(rootPackageJsonPath, 'utf-8')
  )

  const modules: { name: string; version: string; folder: string }[] = []

  for (const [dep, version] of Object.entries(
    rootPackageJson.dependencies || {}
  )) {
    if (dep.startsWith(LIFEFORGE_SCOPE) && version === 'workspace:*') {
      // Get version from the module's package.json
      const folderName = dep.replace(LIFEFORGE_SCOPE, '')

      const modulePath = path.join(
        process.cwd(),
        'apps',
        folderName,
        'package.json'
      )

      if (fs.existsSync(modulePath)) {
        const modulePackageJson = JSON.parse(
          fs.readFileSync(modulePath, 'utf-8')
        )

        modules.push({
          name: dep,
          version: modulePackageJson.version || '0.0.0',
          folder: folderName
        })
      }
    }
  }

  return modules
}

async function getLatestVersion(packageName: string): Promise<string | null> {
  const registry = getRegistryUrl()

  try {
    // Query local Verdaccio registry using bun
    const response = await fetch(`${registry}${packageName}`)

    // If unauthorized, check auth and prompt login
    if (response.status === 401 || response.status === 403) {
      const auth = await checkAuth()

      if (!auth.authenticated) {
        CLILoggingService.info(
          `Authentication required to check updates for ${packageName}`
        )

        const shouldLogin = await confirmAction(
          'Would you like to open the login page now?'
        )

        if (shouldLogin) {
          openRegistryLogin()
          CLILoggingService.info(
            'After logging in and copying your token, run: bun forge modules login'
          )
          CLILoggingService.info('Then try upgrading again.')

          return null
        }
      }
    }

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as {
      'dist-tags'?: { latest?: string }
    }

    return data['dist-tags']?.latest || null
  } catch {
    return null
  }
}

function compareVersions(current: string, latest: string): number {
  const currentParts = current.split('.').map(Number)

  const latestParts = latest.split('.').map(Number)

  for (let i = 0; i < 3; i++) {
    const c = currentParts[i] || 0

    const l = latestParts[i] || 0

    if (l > c) {
      return 1
    }

    if (l < c) {
      return -1
    }
  }

  return 0
}

async function upgradeModule(
  packageName: string,
  folder: string,
  currentVersion: string
): Promise<boolean> {
  const latestVersion = await getLatestVersion(packageName)

  if (!latestVersion) {
    CLILoggingService.warn(`Could not check registry for ${packageName}`)

    return false
  }

  if (compareVersions(currentVersion, latestVersion) >= 0) {
    CLILoggingService.info(`${packageName}@${currentVersion} is up to date`)

    return false
  }

  CLILoggingService.info(
    `Update available: ${packageName} ${currentVersion} → ${latestVersion}`
  )

  const shouldUpgrade = await confirmAction(
    `Upgrade ${packageName}? This will replace your local copy.`
  )

  if (!shouldUpgrade) {
    CLILoggingService.info(`Skipping ${packageName}`)

    return false
  }

  const appsDir = path.join(process.cwd(), 'apps')

  const modulePath = path.join(appsDir, folder)

  const backupPath = path.join(appsDir, `${folder}.backup`)

  try {
    // Backup current module
    CLILoggingService.progress(`Backing up ${folder}...`)

    if (fs.existsSync(backupPath)) {
      fs.rmSync(backupPath, { recursive: true, force: true })
    }

    fs.cpSync(modulePath, backupPath, { recursive: true })

    // Remove current module
    fs.rmSync(modulePath, { recursive: true, force: true })

    // Fetch latest from registry
    CLILoggingService.progress(`Fetching ${packageName}@${latestVersion}...`)

    executeCommand(`bun add ${packageName}@latest`, {
      cwd: process.cwd(),
      stdio: 'inherit'
    })

    // Find installed path in node_modules
    const installedPath = path.join(process.cwd(), 'node_modules', packageName)

    if (!fs.existsSync(installedPath)) {
      throw new Error(`Failed to fetch ${packageName} from registry`)
    }

    // Copy to apps/
    fs.cpSync(installedPath, modulePath, { recursive: true })

    // Remove node_modules copy so bun creates symlink
    fs.rmSync(installedPath, { recursive: true, force: true })

    // Run bun install
    executeCommand('bun install', {
      cwd: process.cwd(),
      stdio: 'inherit'
    })

    // Remove backup on success
    fs.rmSync(backupPath, { recursive: true, force: true })

    CLILoggingService.success(`Upgraded ${packageName} to ${latestVersion}`)

    return true
  } catch (error) {
    CLILoggingService.error(`Failed to upgrade ${packageName}: ${error}`)

    // Restore from backup if exists
    if (fs.existsSync(backupPath)) {
      CLILoggingService.progress('Restoring from backup...')

      if (fs.existsSync(modulePath)) {
        fs.rmSync(modulePath, { recursive: true, force: true })
      }

      fs.renameSync(backupPath, modulePath)
      CLILoggingService.info('Restored previous version')
    }

    return false
  }
}

export async function upgradeModuleHandler(moduleName?: string): Promise<void> {
  const modules = getInstalledModules()

  if (modules.length === 0) {
    CLILoggingService.info('No @lifeforge/* modules installed')

    return
  }

  let upgradedCount = 0

  if (moduleName) {
    // Upgrade specific module
    const normalizedName = moduleName.startsWith(LIFEFORGE_SCOPE)
      ? moduleName
      : `${LIFEFORGE_SCOPE}${moduleName}`

    const mod = modules.find(
      m => m.name === normalizedName || m.folder === moduleName
    )

    if (!mod) {
      CLILoggingService.actionableError(
        `Module "${moduleName}" not found`,
        'Run "bun forge modules list" to see installed modules'
      )
      process.exit(1)
    }

    const upgraded = await upgradeModule(mod.name, mod.folder, mod.version)

    if (upgraded) {
      upgradedCount++
    }
  } else {
    // Check all modules for updates
    CLILoggingService.step('Checking for updates...')

    for (const mod of modules) {
      const upgraded = await upgradeModule(mod.name, mod.folder, mod.version)

      if (upgraded) {
        upgradedCount++
      }
    }
  }

  if (upgradedCount > 0) {
    CLILoggingService.progress('Regenerating registries...')
    generateModuleRegistries()

    CLILoggingService.success(`Upgraded ${upgradedCount} module(s)`)
  }
}
