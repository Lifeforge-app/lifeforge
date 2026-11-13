import ClientError from '../response/ClientError'

interface PostgresErrorLike {
  code?: string
  detail?: string
}

const UNIQUE_DETAIL = /Key \((.+?)\)=\(.*?\) already exists/
const FOREIGN_KEY_DETAIL =
  /Key \((.+?)\)=\(.*?\) is not present in table "(.+?)"/

/**
 * Maps a raw Postgres constraint error to a `ClientError`:
 * - `23503` (foreign key violation) → `404`
 * - `23505` (unique violation) → `409`
 *
 * Handles both bare `postgres` errors and drizzle's `DrizzleQueryError`, which
 * wraps the driver error in `.cause`. Returns `null` for anything else.
 */
export function mapDatabaseError(err: unknown): ClientError | null {
  const source = (err as { cause?: unknown } | null | undefined)?.cause ?? err

  const pg = source as PostgresErrorLike | null

  if (!pg || typeof pg !== 'object' || typeof pg.code !== 'string') {
    return null
  }

  if (pg.code === '23505') {
    const match = pg.detail?.match(UNIQUE_DETAIL)

    return new ClientError(
      match ? `Duplicate value for "${match[1]}"` : 'Duplicate value',
      409
    )
  }

  if (pg.code === '23503') {
    const match = pg.detail?.match(FOREIGN_KEY_DETAIL)

    return new ClientError(
      match
        ? `Related "${match[2]}" record not found (${match[1]})`
        : 'Related record not found',
      404
    )
  }

  return null
}
