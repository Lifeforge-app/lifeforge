import Logging from '@/utils/logging'

/**
 * Extract username and module name from a package name format
 *
 * Examples:
 * - "melvinchia3636--invoice-maker" → { username: "melvinchia3636", moduleName: "invoice_maker" }
 * - "lifeforge--achievements" → { moduleName: "achievements" } (official, no username)
 */
export function parsePackageName(packageName: string): {
  username?: string
  moduleName: string
} {
  const withoutScope = packageName.replace(/^@lifeforge\//, '')

  if (!withoutScope.includes('--')) {
    Logging.error(`Invalid package name: ${packageName}`)
    process.exit(1)
  }

  const [username, moduleName] = withoutScope.split('--', 2)

  return {
    username: username === 'lifeforge' ? undefined : username,
    moduleName: moduleName.replace(/-/g, '_')
  }
}
