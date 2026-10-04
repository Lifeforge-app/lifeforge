import path from 'node:path'

/** Repository root (apps/api/scripts/migrations/lib -> repo root). */
export const ROOT_DIR = path.resolve(import.meta.dirname, '../../../../..')

/** Path to the PocketBase SQLite database. */
export const PB_DB_PATH = path.join(ROOT_DIR, 'database/pb_data/data.db')

/** Path to the local env file holding DATABASE_URL / PB_HOST. */
export const ENV_PATH = path.join(ROOT_DIR, 'env/.env.local')

/**
 * Fixed namespace used to derive deterministic UUIDs from PocketBase ids:
 * `newId(pbId) = uuidv5(pbId, NAMESPACE_ID)`.
 *
 * NEVER change this value. Every migrated row's primary key and every relation
 * link depends on it; changing it breaks linkage with previously migrated data.
 */
export const NAMESPACE_ID = '1b671a64-40d5-491e-99b0-da01ff1f3341'
