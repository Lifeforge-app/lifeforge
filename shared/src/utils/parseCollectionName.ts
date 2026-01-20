import _ from 'lodash'

// Triple underscore separates username from module name
const USERNAME_SEPARATOR = {
  code: '$',
  pb: '___'
}

// Double underscore separates module name from collection name
const COLLECTION_SEPARATOR = {
  code: '__',
  pb: '__'
}

/**
 * Parse a PocketBase collection name into components
 *
 * Examples:
 * - "melvinchia3636___melvinchia3636$clients" → { username: "melvinchia3636", moduleName: "invoice_maker", collectionName: "clients" }
 * - "achievements__badges" → { moduleName: "achievements", collectionName: "badges" }
 */
export default function parseCollectionName(
  str: string,
  from: 'code' | 'pb',
  fallbackModuleName?: string
): {
  username?: string
  moduleName: string
  collectionName: string
} {
  const userNameSeparator = USERNAME_SEPARATOR[from]

  const collectionSeparator = COLLECTION_SEPARATOR[from]

  if (str.includes(userNameSeparator)) {
    const [username, remainder] = str.split(userNameSeparator, 2)

    if (!remainder?.includes(collectionSeparator)) {
      if (!fallbackModuleName) {
        throw new Error(`Invalid collection name: ${str}`)
      }

      return {
        moduleName: fallbackModuleName,
        collectionName: str
      }
    }

    const [moduleName, collectionName] = remainder.split(collectionSeparator, 2)

    return {
      username,
      moduleName: _.snakeCase(moduleName),
      collectionName: _.snakeCase(collectionName)
    }
  }

  if (!str.includes(collectionSeparator)) {
    if (!fallbackModuleName) {
      throw new Error(`Invalid collection name: ${str}`)
    }

    return {
      moduleName: fallbackModuleName,
      collectionName: _.snakeCase(str)
    }
  }

  const [moduleName, collectionName] = str.split(collectionSeparator, 2)

  return {
    moduleName: _.snakeCase(moduleName),
    collectionName: _.snakeCase(collectionName)
  }
}
