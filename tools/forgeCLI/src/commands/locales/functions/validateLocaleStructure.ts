import fs from 'fs'
import path from 'path'

import CLILoggingService from '@/utils/logging'

interface LocalePackageJson {
  name?: string
  version?: string
  lifeforge?: {
    displayName?: string
    icon?: string
  }
  [key: string]: unknown
}

export function validateLocaleStructure(localePath: string) {
  const errors: string[] = []

  const warnings: string[] = []

  const packageJsonPath = path.join(localePath, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    errors.push('Missing package.json')

    return { valid: false, errors, warnings }
  }

  const packageJson: LocalePackageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, 'utf-8')
  )

  if (!packageJson.name) {
    errors.push('package.json is missing "name" field')
  } else if (!packageJson.name.startsWith('@lifeforge/lang-')) {
    errors.push('Package name must start with "@lifeforge/lang-"')
  }

  if (!packageJson.version) {
    errors.push('package.json is missing "version" field')
  } else if (!packageJson.version.match(/^\d+\.\d+\.\d+/)) {
    errors.push('Version must be valid semver (e.g., 0.1.0)')
  }

  if (!packageJson.lifeforge) {
    errors.push('package.json is missing "lifeforge" field')
  } else {
    if (!packageJson.lifeforge.displayName) {
      errors.push('lifeforge.displayName is required')
    }

    if (!packageJson.lifeforge.icon) {
      warnings.push('lifeforge.icon is missing (optional)')
    }
  }

  if (errors.length > 0) {
    CLILoggingService.error('Locale validation failed:')
    errors.forEach(err => CLILoggingService.error(`  - ${err}`))

    process.exit(1)
  }

  warnings.forEach(warn => CLILoggingService.warn(`  - ${warn}`))
}
