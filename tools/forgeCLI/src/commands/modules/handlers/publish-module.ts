import fs from 'fs'
import path from 'path'

import { confirmAction, executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

import {
  checkAuth,
  getRegistryUrl,
  openRegistryLogin
} from '../../../utils/registry'
import { validateMaintainerAccess } from '../functions'

const LIFEFORGE_SCOPE = '@lifeforge'

interface PackageJson {
  name?: string
  version?: string
  description?: string
  exports?: Record<string, unknown>
  [key: string]: unknown
}

interface ModuleValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

function validateModuleStructure(modulePath: string): ModuleValidationResult {
  const errors: string[] = []

  const warnings: string[] = []

  // Check package.json
  const packageJsonPath = path.join(modulePath, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    errors.push('Missing package.json')

    return { valid: false, errors, warnings }
  }

  const packageJson: PackageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, 'utf-8')
  )

  // Check name follows @lifeforge/<username>--<module> pattern
  if (!packageJson.name) {
    errors.push('package.json is missing "name" field')
  } else if (!packageJson.name.startsWith(`${LIFEFORGE_SCOPE}/`)) {
    errors.push(`Package name must start with "${LIFEFORGE_SCOPE}/"`)
  } else {
    const nameWithoutScope = packageJson.name.replace(`${LIFEFORGE_SCOPE}/`, '')

    if (!nameWithoutScope.includes('--')) {
      errors.push(
        'Package name must follow format @lifeforge/<username>--<module>'
      )
    }
  }

  // Check version is semver
  if (!packageJson.version) {
    errors.push('package.json is missing "version" field')
  } else if (!packageJson.version.match(/^\d+\.\d+\.\d+/)) {
    errors.push('Version must be valid semver (e.g., 0.1.0)')
  }

  // Check exports field
  if (!packageJson.exports) {
    errors.push('package.json is missing "exports" field')
  } else {
    if (!packageJson.exports['./manifest']) {
      errors.push('exports must include "./manifest"')
    }
  }

  // Check manifest.ts exists
  const manifestPath = path.join(modulePath, 'manifest.ts')

  if (!fs.existsSync(manifestPath)) {
    errors.push('Missing manifest.ts')
  }

  // Check client directory
  const clientPath = path.join(modulePath, 'client')

  if (!fs.existsSync(clientPath)) {
    warnings.push('No client/ directory found')
  }

  // Check locales directory
  const localesPath = path.join(modulePath, 'locales')

  if (!fs.existsSync(localesPath)) {
    warnings.push('No locales/ directory found')
  }

  // Check server if exports reference it
  if (packageJson.exports?.['./server']) {
    const serverIndexPath = path.join(modulePath, 'server', 'index.ts')

    if (!fs.existsSync(serverIndexPath)) {
      errors.push('exports references "./server" but server/index.ts not found')
    }
  }

  if (packageJson.exports?.['./server/schema']) {
    const schemaPath = path.join(modulePath, 'server', 'schema.ts')

    if (!fs.existsSync(schemaPath)) {
      errors.push(
        'exports references "./server/schema" but server/schema.ts not found'
      )
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

async function promptNpmLogin(): Promise<boolean> {
  CLILoggingService.info('You need to authenticate with the registry first.')
  CLILoggingService.info(
    'The new authentication flow requires a browser login.'
  )

  const shouldLogin = await confirmAction(
    'Would you like to open the login page now?'
  )

  if (shouldLogin) {
    openRegistryLogin()

    CLILoggingService.info('After logging in and copying your token, run:')
    CLILoggingService.info('  bun forge modules login')

    return false // Return false to stop execution and let user run login command
  }

  return false
}

export async function publishModuleHandler(
  folderName: string,
  options?: { official?: boolean }
): Promise<void> {
  // Normalize folder name
  const moduleName = folderName.replace(/^apps\//, '')

  const modulePath = path.join(process.cwd(), 'apps', moduleName)

  // Check module exists
  if (!fs.existsSync(modulePath)) {
    CLILoggingService.actionableError(
      `Module "${moduleName}" not found in apps/`,
      'Make sure the module exists in the apps directory'
    )
    process.exit(1)
  }

  CLILoggingService.step(`Validating module "${moduleName}"...`)

  // Validate structure
  const validation = validateModuleStructure(modulePath)

  if (validation.warnings.length > 0) {
    validation.warnings.forEach(warning => {
      CLILoggingService.warn(`  ⚠ ${warning}`)
    })
  }

  if (!validation.valid) {
    CLILoggingService.error('Module validation failed:')
    validation.errors.forEach(error => {
      CLILoggingService.error(`  ✗ ${error}`)
    })
    process.exit(1)
  }

  CLILoggingService.success('Module structure is valid')

  // Check authentication
  CLILoggingService.progress('Checking registry authentication...')

  let auth = await checkAuth()

  if (!auth.authenticated) {
    const loggedIn = await promptNpmLogin()

    if (!loggedIn) {
      CLILoggingService.actionableError(
        'Authentication required to publish',
        `Run: bun forge modules login`
      )
      process.exit(1)
    }

    auth = await checkAuth()

    if (!auth.authenticated) {
      CLILoggingService.error('Authentication failed')
      process.exit(1)
    }
  }

  CLILoggingService.success(`Authenticated as ${auth.username}`)

  // Read package.json for display
  const packageJson: PackageJson = JSON.parse(
    fs.readFileSync(path.join(modulePath, 'package.json'), 'utf-8')
  )

  // Verify authenticated user matches package name prefix
  const nameWithoutScope = (packageJson.name || '').replace(
    `${LIFEFORGE_SCOPE}/`,
    ''
  )

  const usernamePrefix = nameWithoutScope.split('--')[0]

  if (usernamePrefix && usernamePrefix !== auth.username) {
    // Check if publishing as official module and prefix is lifeforge
    if (options?.official && usernamePrefix === 'lifeforge') {
      const isMaintainer = validateMaintainerAccess(auth.username || '')

      if (!isMaintainer) {
        CLILoggingService.actionableError(
          'Maintainer access required',
          'You must have maintainer access to lifeforge-app/lifeforge to publish official modules'
        )
        process.exit(1)
      }
      // Pass validation if maintainer
    } else {
      CLILoggingService.actionableError(
        `Cannot publish as "${auth.username}" - package belongs to "${usernamePrefix}"`,
        `You can only publish packages starting with @lifeforge/${auth.username}--`
      )
      process.exit(1)
    }
  }

  CLILoggingService.info(`Package: ${packageJson.name}@${packageJson.version}`)
  CLILoggingService.info(`Description: ${packageJson.description || '(none)'}`)

  // Confirm publish
  const shouldPublish = await confirmAction(
    `Publish ${packageJson.name}@${packageJson.version} to registry?`
  )

  if (!shouldPublish) {
    CLILoggingService.info('Publish cancelled')

    return
  }

  // Publish to registry
  CLILoggingService.progress('Publishing to registry...')

  try {
    executeCommand(`npm publish --registry ${getRegistryUrl()}`, {
      cwd: modulePath,
      stdio: 'inherit'
    })

    CLILoggingService.success(
      `Published ${packageJson.name}@${packageJson.version} to registry!`
    )
    CLILoggingService.info('')
    CLILoggingService.info('Others can install with:')
    CLILoggingService.info(`  bun forge modules install ${packageJson.name}`)
  } catch (error) {
    CLILoggingService.error(`Publish failed: ${error}`)
    process.exit(1)
  }
}
