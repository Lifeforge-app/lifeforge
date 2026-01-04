/**
 * Namespace utility functions for converting between code format ($) and PocketBase format (___)
 */

// Triple underscore separates username from module name
const USERNAME_SEPARATOR = '___'

// Double underscore separates module name from collection name
const COLLECTION_SEPARATOR = '__'

// Dollar sign is used in code format for username separator
const CODE_USERNAME_SEPARATOR = '$'

/**
 * Convert code format to PocketBase format
 * username$module_name → username___module_name
 */
export function toPocketBaseNamespace(codeNamespace: string): string {
  return codeNamespace.replace(CODE_USERNAME_SEPARATOR, USERNAME_SEPARATOR)
}

/**
 * Convert PocketBase format to code format
 * username___module_name → username$module_name
 */
export function toCodeNamespace(pbNamespace: string): string {
  // Only convert the first occurrence (username separator)
  const idx = pbNamespace.indexOf(USERNAME_SEPARATOR)

  if (idx === -1) {
    return pbNamespace
  }

  return (
    pbNamespace.slice(0, idx) +
    CODE_USERNAME_SEPARATOR +
    pbNamespace.slice(idx + USERNAME_SEPARATOR.length)
  )
}

/**
 * Parse a PocketBase collection name into components
 *
 * Examples:
 * - "melvinchia3636___melvinchia3636$melvinchia3636$invoice_maker__clients" → { username: "melvinchia3636", moduleName: "invoice_maker", collectionName: "clients" }
 * - "achievements__badges" → { moduleName: "achievements", collectionName: "badges" }
 */
export function parseCollectionName(pbCollectionName: string): {
  username?: string
  moduleName: string
  collectionName: string
} {
  // Check for triple underscore (username separator)
  const usernameIdx = pbCollectionName.indexOf(USERNAME_SEPARATOR)

  if (usernameIdx !== -1) {
    // Third-party module
    const username = pbCollectionName.slice(0, usernameIdx)

    const remainder = pbCollectionName.slice(
      usernameIdx + USERNAME_SEPARATOR.length
    )

    const moduleIdx = remainder.indexOf(COLLECTION_SEPARATOR)

    if (moduleIdx === -1) {
      return { username, moduleName: remainder, collectionName: remainder }
    }

    return {
      username,
      moduleName: remainder.slice(0, moduleIdx),
      collectionName: remainder.slice(moduleIdx + COLLECTION_SEPARATOR.length)
    }
  }

  // Official module - split on first double underscore
  const moduleIdx = pbCollectionName.indexOf(COLLECTION_SEPARATOR)

  if (moduleIdx === -1) {
    return { moduleName: pbCollectionName, collectionName: pbCollectionName }
  }

  return {
    moduleName: pbCollectionName.slice(0, moduleIdx),
    collectionName: pbCollectionName.slice(
      moduleIdx + COLLECTION_SEPARATOR.length
    )
  }
}

/**
 * Build a full PocketBase collection name from components
 *
 * Examples:
 * - ("invoice_maker", "clients", "melvinchia3636") → "melvinchia3636___melvinchia3636$melvinchia3636$invoice_maker__clients"
 * - ("achievements", "badges") → "achievements__badges"
 */
export function buildCollectionName(
  moduleName: string,
  collectionName: string,
  username?: string
): string {
  const modulePrefix = username
    ? `${username}${USERNAME_SEPARATOR}${moduleName}`
    : moduleName

  return `${modulePrefix}${COLLECTION_SEPARATOR}${collectionName}`
}

/**
 * Check if a module name indicates a third-party module
 * (contains double dash in package name format)
 */
export function isThirdPartyModule(moduleName: string): boolean {
  return moduleName.includes('--')
}

/**
 * Extract username and module name from a package name format
 * "melvinchia3636--invoice-maker" → { username: "melvinchia3636", moduleName: "invoice_maker" }
 * "lifeforge--achievements" → { moduleName: "achievements" } (official, no username)
 */
export function parsePackageName(packageName: string): {
  username?: string
  moduleName: string
} {
  if (!packageName.includes('--')) {
    return { moduleName: packageName.replace(/-/g, '_') }
  }

  const [first, ...rest] = packageName.split('--')

  const moduleName = rest.join('--').replace(/-/g, '_')

  // Official modules start with "lifeforge"
  if (first === 'lifeforge') {
    return { moduleName }
  }

  return { username: first, moduleName }
}
