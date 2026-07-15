import PocketBase from 'pocketbase'

import { connectToPocketBase, validateEnvironmentVariables } from '@functions/database/dbUtils'

import { hashToken } from './tokens'

interface RefreshTokenRecord {
  id: string
  token_hash: string
  family: string
  bound_ip: string
  last_ip: string
  expires_at: string
  revoked: boolean
  last_used_at: string
  created: string
  updated: string
}

let pbInstance: PocketBase | null = null

async function getPB(): Promise<PocketBase> {
  if (!pbInstance) {
    pbInstance = await connectToPocketBase(validateEnvironmentVariables())
  }
  return pbInstance
}

export async function storeRefreshToken(params: {
  token: string
  family: string
  ip: string
}): Promise<void> {
  const pb = await getPB()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const now = new Date().toISOString()

  await pb.collection('user__auth_refresh_tokens').create({
    token_hash: hashToken(params.token),
    family: params.family,
    bound_ip: params.ip,
    last_ip: params.ip,
    expires_at: expiresAt,
    revoked: false,
    last_used_at: now
  })
}

export async function findToken(
  token: string
): Promise<RefreshTokenRecord | null> {
  const pb = await getPB()
  const tokenHash = hashToken(token)

  try {
    const records = await pb
      .collection('user__auth_refresh_tokens')
      .getFullList({ filter: `token_hash = "${tokenHash}"` })

    return records.length > 0 ? (records[0] as unknown as RefreshTokenRecord) : null
  } catch {
    return null
  }
}

export async function rotateToken(params: {
  oldTokenHash: string
  newToken: string
  ip: string
  family: string
}): Promise<void> {
  const pb = await getPB()
  const newTokenHash = hashToken(params.newToken)
  const now = new Date().toISOString()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  const records = await pb
    .collection('user__auth_refresh_tokens')
    .getFullList({ filter: `token_hash = "${params.oldTokenHash}"` })

  if (records.length > 0) {
    const oldRecord = records[0] as unknown as RefreshTokenRecord

    if (oldRecord.revoked) return

    await pb
      .collection('user__auth_refresh_tokens')
      .update(records[0].id, {
        revoked: true,
        last_used_at: now,
        last_ip: params.ip
      })

    await pb.collection('user__auth_refresh_tokens').create({
      token_hash: newTokenHash,
      family: params.family,
      bound_ip: params.ip,
      last_ip: params.ip,
      expires_at: expiresAt,
      revoked: false,
      last_used_at: now
    })
  }
}

export async function revokeFamily(family: string): Promise<void> {
  const pb = await getPB()

  const records = await pb
    .collection('user__auth_refresh_tokens')
    .getFullList({ filter: `family = "${family}"` })

  for (const record of records) {
    await pb
      .collection('user__auth_refresh_tokens')
      .update(record.id, { revoked: true })
  }
}

export async function cleanupExpired(): Promise<void> {
  const pb = await getPB()
  const now = new Date().toISOString()

  const records = await pb
    .collection('user__auth_refresh_tokens')
    .getFullList({
      filter: `expires_at < "${now}" && revoked = false`
    })

  for (const record of records) {
    await pb
      .collection('user__auth_refresh_tokens')
      .update(record.id, { revoked: true })
  }
}
