import chalk from 'chalk'

import logger from '@/utils/logger'

/**
 * Extract username and module name from a package name format
 *
 * Examples:
 * - "melvinchia3636--invoice-maker" → { username: "melvinchia3636", moduleName: "invoice_maker" }
 * - "lifeforge--achievements" → { moduleName: "achievements" } (official, no username)
 */
export function parsePackageName(
  packageName: string,
  isLibModule?: boolean
): {
  username?: string
  moduleName: string
} {
  const withoutScope = packageName.replace(/^@lifeforge\//, '')

  if (!withoutScope.includes('--')) {
    if (!isLibModule) {
      logger.error(
        `Invalid package name: ${chalk.blue(packageName)}. Package name must include "--" separator (e.g., username--module-name)`
      )
      process.exit(1)
    }

    return {
      moduleName: withoutScope.replace(/-/g, '_')
    }
  }

  const [username, moduleName] = withoutScope.split('--', 2)

  return {
    username: username === 'lifeforge' ? undefined : username,
    moduleName: moduleName.replace(/-/g, '_')
  }
}
