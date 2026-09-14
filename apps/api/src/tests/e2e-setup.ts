import { notInArray } from 'drizzle-orm'
import { db } from '../core/drizzle'
import { authRefreshTokens } from '../lib/auth/schema.drizzle'
import { forgeAPI } from './utils'

let cachedEmail = ''
let cachedPassword = ''
let cachedUsername = ''
let cachedName = ''
let initialized = false
let snapshotIds: string[] = []

async function connectToServer(): Promise<boolean> {
  try {
    const res = await fetch('http://localhost:3636/status')

    return res.ok
  } catch {
    return false
  }
}

export async function initAuthTests(): Promise<{
  email: string
  password: string
  username: string
  name: string
}> {
  if (initialized) {
    return {
      email: cachedEmail,
      password: cachedPassword,
      username: cachedUsername,
      name: cachedName
    }
  }

  const serverAlive = await connectToServer()

  if (!serverAlive) {
    throw new Error(
      'Cannot connect to API server at http://localhost:3636. Start with: cd apps/api && pnpm dev'
    )
  }

  const TEST_USER_PASSWORD = process.env.VITE_TEST_USER_PASSWORD

  if (!TEST_USER_PASSWORD) {
    throw new Error(
      'TEST_USER_PASSWORD must be set in env/.env.local.'
    )
  }

  const existingTokens = await db.query.authRefreshTokens.findMany()

  snapshotIds = existingTokens.map(r => r.id)

  const allUsers = await db.query.users.findMany()

  if (allUsers.length === 0) {
    throw new Error(
      'No users found in database. Create a user first.'
    )
  }

  const firstUser = allUsers[0]
  cachedEmail = firstUser.email
  cachedUsername = firstUser.username
  cachedName = firstUser.name || ''
  cachedPassword = TEST_USER_PASSWORD

  if (!firstUser.auth_password_hash) {
    throw new Error(
      `User ${cachedEmail} has no auth_password_hash.`
    )
  }

  console.log(`\nTesting with user: ${cachedEmail} (${cachedName})\n`)

  const loginRes = await forgeAPI.auth.login.mutateRaw(
    { email: cachedEmail, password: cachedPassword },
    { raw: true }
  )

  if (loginRes.status !== 200) {
    throw new Error(
      `Login failed for ${cachedEmail}. Check that TEST_USER_PASSWORD is correct in env/.env.local.`
    )
  }

  initialized = true

  return {
    email: cachedEmail,
    password: cachedPassword,
    username: cachedUsername,
    name: cachedName
  }
}

export async function cleanupTestTokens(): Promise<void> {
  if (snapshotIds.length > 0) {
    await db
      .delete(authRefreshTokens)
      .where(notInArray(authRefreshTokens.id, snapshotIds))
  } else {
    await db.delete(authRefreshTokens)
  }
}
