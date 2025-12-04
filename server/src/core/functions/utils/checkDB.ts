import { LoggingService } from '@functions/logging/loggingService'
import COLLECTION_SCHEMAS, { SCHEMAS } from '@schema'
import chalk from 'chalk'
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
  collectionsWithDiscrepancies: string[]
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
  return collectionName === 'user__users' ? 'users' : collectionName
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

  const collectionsWithDiscrepancies: string[] = []

  for (const collection of requiredCollections) {
    const targetCollection = mapCollectionName(collection)

    if (!existingCollectionNames.has(targetCollection)) {
      missingCollections.push(collection)
    }

    const existingCollection = allCollections.find(
      c => c.name === targetCollection
    )

    const requiredSchema =
      // @ts-expect-error: Lazy to fix :)
      SCHEMAS[collection.split('__')[0]][collection.split('__')[1]].raw

    delete existingCollection?.updated
    delete existingCollection?.created
    delete requiredSchema?.updated
    delete requiredSchema?.created

    existingCollection?.fields.forEach((field: any) => delete field.id)
    requiredSchema?.fields.forEach((field: any) => delete field.id)

    if ('oauth2' in requiredCollections) {
      delete requiredCollections?.oauth2
    }
    delete existingCollection?.oauth2

    if (JSON.stringify(existingCollection) !== JSON.stringify(requiredSchema)) {
      collectionsWithDiscrepancies.push(collection)
    }
  }

  return {
    isValid:
      missingCollections.length === 0 &&
      collectionsWithDiscrepancies.length === 0,
    missingCollections,
    collectionsWithDiscrepancies,
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
      if (validationResult.missingCollections.length > 0) {
        throw new DatabaseValidationError(
          `Missing collections in PocketBase: ${validationResult.missingCollections.join(', ')}`
        )
      }

      if (validationResult.collectionsWithDiscrepancies.length > 0) {
        throw new DatabaseValidationError(
          `Collections with schema discrepancies: ${validationResult.collectionsWithDiscrepancies.join(', ')}. If the collection has been updated in the database, please run "${chalk.cyan('bun forge db generate-schemas')}" to synchronize the schema. If the collection has been modified outside of LifeForge, please revert the changes to ensure compatibility.`
        )
      }

      throw new DatabaseValidationError(
        'Database validation failed due to unknown reasons'
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
