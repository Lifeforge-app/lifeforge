import { LoggingService } from '@functions/logging/loggingService'
import COLLECTION_SCHEMAS from '@schema'
import Pocketbase from 'pocketbase'

interface DBConnectionConfig {
  host: string
  email: string
  password: string
}

interface CollectionValidationResult {
  isValid: boolean
  missingCollections: string[]
  totalCollections: number
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
  constructor(
    message: string,
    public readonly missingCollections: string[]
  ) {
    super(message)
    this.name = 'DatabaseValidationError'
  }
}

/**
 * Validates the required environment variables for database connection
 * @throws {DatabaseConnectionError} When required environment variables are missing
 */
function validateEnvironmentVariables(): DBConnectionConfig {
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
async function connectToPocketBase(
  config: DBConnectionConfig
): Promise<Pocketbase> {
  const pb = new Pocketbase(config.host)

  try {
    await pb
      .collection('_superusers')
      .authWithPassword(config.email, config.password)

    if (!pb.authStore.isSuperuser || !pb.authStore.isValid) {
      throw new DatabaseConnectionError(
        'Authentication failed: Invalid credentials or insufficient privileges'
      )
    }

    LoggingService.info('Successfully connected to PocketBase', 'DB')

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
 * Maps collection names to their target names in PocketBase
 * Handles special cases like users__users -> users
 */
function mapCollectionName(collectionName: string): string {
  return collectionName === 'users__users' ? 'users' : collectionName
}

/**
 * Validates that all required collections exist in PocketBase
 * @param pb Authenticated PocketBase instance
 * @returns Validation result with details about missing collections
 */
async function validateCollections(
  pb: Pocketbase
): Promise<CollectionValidationResult> {
  const allCollections = await pb.collections.getFullList()

  const existingCollectionNames = new Set(allCollections.map(c => c.name))

  const requiredCollections = Object.keys(COLLECTION_SCHEMAS)

  const missingCollections: string[] = []

  for (const collection of requiredCollections) {
    const targetCollection = mapCollectionName(collection)

    if (!existingCollectionNames.has(targetCollection)) {
      missingCollections.push(collection)
    }
  }

  return {
    isValid: missingCollections.length === 0,
    missingCollections,
    totalCollections: requiredCollections.length
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
    const pb = await connectToPocketBase(config)

    // Validate collection schema
    const validationResult = await validateCollections(pb)

    if (!validationResult.isValid) {
      throw new DatabaseValidationError(
        `Missing collections in PocketBase: ${validationResult.missingCollections.join(', ')}`,
        validationResult.missingCollections
      )
    }

    LoggingService.info(
      `Database validation complete. All ${validationResult.totalCollections} collections are present`,
      'DB'
    )
  } catch (error) {
    if (
      error instanceof DatabaseConnectionError ||
      error instanceof DatabaseValidationError
    ) {
      LoggingService.error(error.message, 'DB')
    } else {
      LoggingService.error(
        `Unexpected error during database validation: ${error}`,
        'DB'
      )
    }
    process.exit(1)
  }
}
