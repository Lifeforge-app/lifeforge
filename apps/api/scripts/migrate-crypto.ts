/**
 * One-off migration for values encrypted with the old crypto helpers.
 *
 * Three legacy formats are handled:
 *
 * 1. `api_keys__entries.key`
 *    CryptoJS `AES.encrypt(value, passphrase)` output:
 *    "Salted__" + salt + AES-256-CBC(EVP_BytesToKey(MD5), 1 iteration).
 *
 * 2. `users.two_fa_secret`
 *    AES-256-CTR: base64(iv[16] || ciphertext), key = sha256(passphrase) as
 *    base64 truncated to 32 characters.
 *
 * 3. `auth__oauth_providers.client_id / client_secret`
 *    Same AES-256-CTR format as (2).
 *
 * All values are re-encrypted with the current AES-256-GCM format
 * (`encrypt` in `src/core/functions/auth/encryption.ts`).
 *
 * Run:
 *   pnpm --filter @lifeforge/server migrate:crypto --dry-run
 *   pnpm --filter @lifeforge/server migrate:crypto
 *
 * Idempotent: values already in the `v2:` format are skipped.
 */
import crypto from 'crypto'
import postgres from 'postgres'

import { requireEnv } from './migrations/lib/env'

const NEW_FORMAT_PREFIX = 'v2:'

const LEGACY_CBC_ALGORITHM = 'aes-256-cbc'
const LEGACY_CBC_KEY_LENGTH = 32
const LEGACY_CBC_IV_LENGTH = 16
const LEGACY_CBC_SALT_LENGTH = 8
const LEGACY_CBC_SALT_HEADER = Buffer.from('Salted__', 'ascii')

const LEGACY_CTR_ALGORITHM = 'aes-256-ctr'
const LEGACY_CTR_IV_LENGTH = 16
const LEGACY_CTR_KEY_LENGTH = 32

const GCM_ALGORITHM = 'aes-256-gcm'
const GCM_IV_LENGTH = 12

interface Failure {
  table: string
  id: string
  label: string
  reason: string
}

interface Summary {
  migrated: number
  skipped: number
  failures: Failure[]
}

function createSummary(): Summary {
  return { migrated: 0, skipped: 0, failures: [] }
}

// ============================================
// Current format
// ============================================

function encryptCurrent(plaintext: string, passphrase: string): string {
  const key = crypto.createHash('sha256').update(String(passphrase)).digest()

  const iv = crypto.randomBytes(GCM_IV_LENGTH)

  const cipher = crypto.createCipheriv(GCM_ALGORITHM, key, iv)

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final()
  ])

  return (
    NEW_FORMAT_PREFIX +
    Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64')
  )
}

// ============================================
// Legacy: CryptoJS / OpenSSL AES-256-CBC
// ============================================

function evpBytesToKey(
  password: Buffer,
  salt: Buffer
): { key: Buffer; iv: Buffer } {
  let derived = Buffer.alloc(0)
  let block = Buffer.alloc(0)

  while (derived.length < LEGACY_CBC_KEY_LENGTH + LEGACY_CBC_IV_LENGTH) {
    block = crypto
      .createHash('md5')
      .update(Buffer.concat([block, password, salt]))
      .digest()

    derived = Buffer.concat([derived, block])
  }

  return {
    key: derived.subarray(0, LEGACY_CBC_KEY_LENGTH),
    iv: derived.subarray(
      LEGACY_CBC_KEY_LENGTH,
      LEGACY_CBC_KEY_LENGTH + LEGACY_CBC_IV_LENGTH
    )
  }
}

function decryptLegacyCbc(ciphertext: string, passphrase: string): string {
  const payload = Buffer.from(ciphertext, 'base64')

  if (
    payload.length < LEGACY_CBC_SALT_HEADER.length + LEGACY_CBC_SALT_LENGTH ||
    !payload
      .subarray(0, LEGACY_CBC_SALT_HEADER.length)
      .equals(LEGACY_CBC_SALT_HEADER)
  ) {
    throw new Error('missing OpenSSL salt header')
  }

  const salt = payload.subarray(
    LEGACY_CBC_SALT_HEADER.length,
    LEGACY_CBC_SALT_HEADER.length + LEGACY_CBC_SALT_LENGTH
  )

  const encrypted = payload.subarray(
    LEGACY_CBC_SALT_HEADER.length + LEGACY_CBC_SALT_LENGTH
  )

  const { key, iv } = evpBytesToKey(Buffer.from(passphrase, 'utf8'), salt)

  const decipher = crypto.createDecipheriv(LEGACY_CBC_ALGORITHM, key, iv)

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    'utf8'
  )
}

// ============================================
// Legacy: AES-256-CTR
// ============================================

function decryptLegacyCtr(ciphertext: string, passphrase: string): string {
  const payload = Buffer.from(ciphertext, 'base64')

  if (payload.length <= LEGACY_CTR_IV_LENGTH) {
    throw new Error('payload too short for AES-CTR')
  }

  const key = crypto
    .createHash('sha256')
    .update(String(passphrase))
    .digest('base64')
    .slice(0, LEGACY_CTR_KEY_LENGTH)

  const iv = payload.subarray(0, LEGACY_CTR_IV_LENGTH)

  const encrypted = payload.subarray(LEGACY_CTR_IV_LENGTH)

  const decipher = crypto.createDecipheriv(LEGACY_CTR_ALGORITHM, key, iv)

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    'utf8'
  )
}

// ============================================
// Migration helpers
// ============================================

function migrateValue(
  summary: Summary,
  plaintext: string,
  masterKey: string
): string {
  summary.migrated++

  return encryptCurrent(plaintext, masterKey)
}

async function migrateApiKeys(
  sql: postgres.Sql,
  masterKey: string,
  dryRun: boolean
): Promise<Summary> {
  const summary = createSummary()

  const rows = await sql<{ id: string; key_id: string; key: string }[]>`
    SELECT id, key_id, key FROM api_keys__entries ORDER BY created
  `

  for (const row of rows) {
    if (row.key.startsWith(NEW_FORMAT_PREFIX)) {
      summary.skipped++
      continue
    }

    try {
      const plaintext = decryptLegacyCbc(row.key, masterKey)

      const encrypted = migrateValue(summary, plaintext, masterKey)

      if (!dryRun) {
        await sql`
          UPDATE api_keys__entries
          SET key = ${encrypted}, updated = now()
          WHERE id = ${row.id}
        `
      }
    } catch (error) {
      summary.failures.push({
        table: 'api_keys__entries',
        id: row.id,
        label: row.key_id,
        reason: error instanceof Error ? error.message : String(error)
      })
    }
  }

  return summary
}

async function migrateTwoFA(
  sql: postgres.Sql,
  masterKey: string,
  dryRun: boolean
): Promise<Summary> {
  const summary = createSummary()

  const rows = await sql<{ id: string; two_fa_secret: string | null }[]>`
    SELECT id, two_fa_secret FROM users WHERE two_fa_secret IS NOT NULL
  `

  for (const row of rows) {
    const value = row.two_fa_secret

    if (!value) {
      continue
    }

    if (value.startsWith(NEW_FORMAT_PREFIX)) {
      summary.skipped++
      continue
    }

    try {
      const plaintext = decryptLegacyCtr(value, masterKey)

      const encrypted = migrateValue(summary, plaintext, masterKey)

      if (!dryRun) {
        await sql`
          UPDATE users
          SET two_fa_secret = ${encrypted}, updated = now()
          WHERE id = ${row.id}
        `
      }
    } catch (error) {
      summary.failures.push({
        table: 'users.two_fa_secret',
        id: row.id,
        label: '2fa',
        reason: error instanceof Error ? error.message : String(error)
      })
    }
  }

  return summary
}

async function migrateOAuthProviders(
  sql: postgres.Sql,
  masterKey: string,
  dryRun: boolean
): Promise<Summary> {
  const summary = createSummary()

  const rows = await sql<
    {
      id: string
      provider: string
      client_id: string | null
      client_secret: string | null
    }[]
  >`
    SELECT id, provider, client_id, client_secret
    FROM auth__oauth_providers
    WHERE client_id IS NOT NULL OR client_secret IS NOT NULL
  `

  for (const row of rows) {
    const updates: Record<string, string> = {}

    for (const column of ['client_id', 'client_secret'] as const) {
      const value = row[column]

      if (!value) {
        continue
      }

      if (value.startsWith(NEW_FORMAT_PREFIX)) {
        summary.skipped++
        continue
      }

      try {
        const plaintext = decryptLegacyCtr(value, masterKey)

        updates[column] = migrateValue(summary, plaintext, masterKey)
      } catch (error) {
        summary.failures.push({
          table: `auth__oauth_providers.${column}`,
          id: row.id,
          label: row.provider,
          reason: error instanceof Error ? error.message : String(error)
        })
      }
    }

    if (!dryRun && Object.keys(updates).length > 0) {
      const id = row.id

      if (updates.client_id !== undefined) {
        await sql`UPDATE auth__oauth_providers SET client_id = ${updates.client_id}, updated = now() WHERE id = ${id}`
      }

      if (updates.client_secret !== undefined) {
        await sql`UPDATE auth__oauth_providers SET client_secret = ${updates.client_secret}, updated = now() WHERE id = ${id}`
      }
    }
  }

  return summary
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run')

  const masterKey = requireEnv('MASTER_KEY')

  const sql = postgres(requireEnv('DATABASE_URL'), { max: 1 })

  try {
    const results: [string, Summary][] = [
      ['API keys', await migrateApiKeys(sql, masterKey, dryRun)],
      ['2FA secrets', await migrateTwoFA(sql, masterKey, dryRun)],
      ['OAuth providers', await migrateOAuthProviders(sql, masterKey, dryRun)]
    ]

    const allFailures: Failure[] = []

    for (const [name, summary] of results) {
      console.log(
        `${name}: ${dryRun ? 'would migrate' : 'migrated'} ${summary.migrated}, ` +
          `already current ${summary.skipped}, failed ${summary.failures.length}`
      )

      allFailures.push(...summary.failures)
    }

    for (const failure of allFailures) {
      console.error(
        `  FAILED ${failure.table} ${failure.label} (${failure.id}): ${failure.reason}`
      )
    }

    if (allFailures.length > 0) {
      process.exitCode = 1
    }
  } finally {
    await sql.end()
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
