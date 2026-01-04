import fs from 'fs'
import path from 'path'
import semver from 'semver'

import { generateMigrationsHandler } from '@/commands/db/handlers/generateMigrationsHandler'
import { installPackage } from '@/utils/commands'
import Logging from '@/utils/logging'
import { getPackageLatestVersion } from '@/utils/registry'

import normalizePackage from '../../../utils/normalizePackage'
import listModules from '../functions/listModules'
import generateSchemaRegistry from '../functions/registry/generateSchemaRegistry'
import generateServerRegistry from '../functions/registry/generateServerRegistry'

async function upgradeModule(
  packageName: string,
  currentVersion: string
): Promise<boolean> {
  const { fullName, targetDir } = normalizePackage(packageName)

  const latestVersion = await getPackageLatestVersion(fullName)

  if (!latestVersion) {
    Logging.warn(`Could not check registry for ${Logging.highlight(fullName)}`)

    return false
  }

  if (semver.eq(currentVersion, latestVersion)) {
    Logging.info(
      `${Logging.highlight(packageName)}@${currentVersion} is up to date`
    )

    return false
  }

  Logging.info(
    `Upgrading ${Logging.highlight(packageName)} from ${currentVersion} to ${latestVersion}...`
  )

  const backupPath = path.join(path.dirname(targetDir), `${packageName}.backup`)

  try {
    if (fs.existsSync(backupPath)) {
      fs.rmSync(backupPath, { recursive: true, force: true })
    }

    fs.cpSync(targetDir, backupPath, { recursive: true })

    fs.rmSync(targetDir, { recursive: true, force: true })

    installPackage(fullName, targetDir)

    fs.rmSync(backupPath, { recursive: true, force: true })

    Logging.success(
      `Upgraded ${Logging.highlight(packageName)} to ${latestVersion}`
    )

    return true
  } catch (error) {
    Logging.error(`Failed to upgrade ${Logging.highlight(fullName)}: ${error}`)

    if (fs.existsSync(backupPath)) {
      fs.renameSync(backupPath, targetDir)
    }

    return false
  }
}

export async function upgradeModuleHandler(moduleName?: string): Promise<void> {
  const modules = listModules()

  let upgradedCount = 0

  if (moduleName) {
    const { fullName } = normalizePackage(moduleName)

    const mod = modules[fullName]

    if (!mod) {
      Logging.actionableError(
        `Module "${moduleName}" not found`,
        'Run "bun forge modules list" to see installed modules'
      )

      process.exit(1)
    }

    const upgraded = await upgradeModule(fullName, mod.version)

    if (upgraded) {
      upgradedCount++
    }
  } else {
    for (const [name, { version }] of Object.entries(modules)) {
      const upgraded = await upgradeModule(name, version)

      if (upgraded) {
        upgradedCount++
      }
    }
  }

  if (upgradedCount > 0) {
    Logging.info('Regenerating registries...')

    generateServerRegistry()

    generateSchemaRegistry()

    generateMigrationsHandler()

    Logging.success(
      `Upgraded ${upgradedCount} module${upgradedCount > 1 ? 's' : ''}`
    )
  }
}
