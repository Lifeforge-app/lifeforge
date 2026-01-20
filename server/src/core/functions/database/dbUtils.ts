import Pocketbase from 'pocketbase'
import { parseCollectionName } from 'shared'

import { PBLogger } from './PBService'

/**
 * Converts a code-format collection name to PocketBase format
 * e.g., "clients" -> "melvinchia3636___clients"
 */
export function toPocketBaseCollectionName(
  codeCollectionName: string,
  moduleID: string
): string {
  codeCollectionName = `${moduleID.replace('--', '___')}__${codeCollectionName}`

  const { username, moduleName, collectionName } = parseCollectionName(
    codeCollectionName,
    'pb'
  )

  if (username === 'lifeforge' || !username) {
    if (collectionName === 'users' && moduleName === 'user') {
      return collectionName
    }

    return `${moduleName}__${collectionName}`
  }

  return `${username}___${moduleName}__${collectionName}`
}

interface DBConnectionConfig {
  host: string
  email: string
  password: string
}

class DatabaseConnectionError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message)
    this.name = 'DatabaseConnectionError'
  }
}

class DatabaseValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DatabaseValidationError'
  }
}

/**
 * Validates the required environment variables for database connection
 * @throws {DatabaseConnectionError} When required environment variables are missing
 */
export function validateEnvironmentVariables(): DBConnectionConfig {
  const { PB_HOST, PB_EMAIL, PB_PASSWORD } = process.env

  if (!PB_HOST || !PB_EMAIL || !PB_PASSWORD) {
    throw new DatabaseConnectionError(
      'Missing required environment variables: PB_HOST, PB_EMAIL, and PB_PASSWORD must be provided'
    )
  }

  return { host: PB_HOST, email: PB_EMAIL, password: PB_PASSWORD }
}

/**
 * Establishes and validates connection to PocketBase with superuser privileges
 * @param config Database connection configuration
 * @returns Authenticated PocketBase instance
 * @throws {DatabaseConnectionError} When connection or authentication fails
 */
export async function connectToPocketBase(
  config: DBConnectionConfig
): Promise<Pocketbase> {
  try {
    const pb = new Pocketbase(config.host)

    await pb
      .collection('_superusers')
      .authWithPassword(config.email, config.password)
      .catch(err => {
        throw new DatabaseConnectionError(
          'Authentication failed: ' + err.message,
          err
        )
      })

    if (!pb.authStore.isSuperuser || !pb.authStore.isValid) {
      throw new DatabaseConnectionError(
        'Authentication failed: Invalid credentials or insufficient privileges'
      )
    }

    PBLogger.debug('Successfully connected to PocketBase')

    return pb
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    throw new DatabaseConnectionError(
      `Failed to connect to PocketBase: ${errorMessage}`,
      error instanceof Error ? error : undefined
    )
  }
}

/**
 * Validates database connection and schema integrity
 * Ensures PocketBase is accessible and contains all required collections
 *
 * @throws {DatabaseConnectionError} When connection fails
 * @throws {DatabaseValidationError} When required collections are missing
 */
export default async function checkDB(): Promise<void> {
  try {
    // Validate environment configuration
    const config = validateEnvironmentVariables()

    // Establish database connection
    await connectToPocketBase(config)
  } catch (error) {
    if (
      error instanceof DatabaseConnectionError ||
      error instanceof DatabaseValidationError
    ) {
      PBLogger.error(error.message)
    } else {
      PBLogger.error(`Unexpected error during database validation: ${error}`)
    }
    process.exit(1)
  }
}
