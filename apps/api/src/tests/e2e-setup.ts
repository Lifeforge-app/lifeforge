import { authenticateSuperuser, forgeAPI, getPB } from './utils'

let cachedEmail = ''
let cachedPassword = ''
let cachedUsername = ''
let cachedName = ''
let initialized = false
let snapshotIds = new Set<string>()

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
      'Cannot connect to API server at http://localhost:3636. Start with: cd apps/api && pnpmdev'
    )
  }

  const PB_EMAIL = process.env.PB_EMAIL
  const PB_PASSWORD = process.env.PB_PASSWORD
  const TEST_USER_PASSWORD = process.env.VITE_TEST_USER_PASSWORD

  if (!PB_EMAIL || !PB_PASSWORD) {
    throw new Error('PB_EMAIL and PB_PASSWORD must be set in env/.env.local')
  }

  if (!TEST_USER_PASSWORD) {
    throw new Error(
      'TEST_USER_PASSWORD must be set in env/.env.local. It should be the password of the first user in PocketBase.'
    )
  }

  await authenticateSuperuser('http://localhost:8090', PB_EMAIL, PB_PASSWORD)

  const pb = getPB()

  const existingTokens = await pb
    .collection('auth__refresh_tokens')
    .getFullList()

  snapshotIds = new Set(existingTokens.map((r: any) => r.id))

  const users = await pb.collection('users').getFullList()

  if (users.length === 0) {
    throw new Error(
      'No users found in PocketBase. Create a user and run the password reset script first.'
    )
  }

  const firstUser = users[0]
  cachedEmail = firstUser.email
  cachedUsername = firstUser.username
  cachedName = firstUser.name
  cachedPassword = TEST_USER_PASSWORD

  if (!(firstUser as Record<string, unknown>).auth_password_hash) {
    throw new Error(
      `User ${cachedEmail} has no auth_password_hash. Run: tsx scripts/reset-passwords.ts`
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
  const pb = getPB()
  const records = await pb.collection('auth__refresh_tokens').getFullList()

  for (const record of records) {
    if (!snapshotIds.has(record.id)) {
      await pb.collection('auth__refresh_tokens').delete(record.id)
    }
  }
}
