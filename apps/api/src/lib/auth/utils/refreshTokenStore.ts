import { z } from 'zod'

import { getPB } from '../constants/pb'
import schema from '../schema'
import { hashToken } from './tokens'

export async function storeRefreshToken(params: {
  token: string
  family: string
  ip: string
}): Promise<void> {
  const pb = await getPB()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const now = new Date().toISOString()

  await pb.create
    .collection('refresh_tokens')
    .data({
      token_hash: hashToken(params.token),
      family: params.family,
      bound_ip: params.ip,
      last_ip: params.ip,
      expires_at: expiresAt,
      revoked: false,
      last_used_at: now
    })
    .execute()
}

export async function findToken(
  token: string
): Promise<z.infer<typeof schema.refresh_tokens> | null> {
  const pb = await getPB()
  const tokenHash = hashToken(token)

  try {
    const records = await pb.getFullList
      .collection('refresh_tokens')
      .filter([
        {
          field: 'token_hash',
          operator: '=',
          value: tokenHash
        }
      ])
      .execute()

    return records.length > 0 ? records[0] : null
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

  const records = await pb.getFullList
    .collection('refresh_tokens')
    .filter([
      {
        field: 'token_hash',
        operator: '=',
        value: params.oldTokenHash
      }
    ])
    .execute()

  if (records.length > 0) {
    const oldRecord = records[0]

    if (oldRecord.revoked) return

    await pb.update
      .collection('refresh_tokens')
      .id(records[0].id)
      .data({
        revoked: true,
        last_used_at: now,
        last_ip: params.ip
      })
      .execute()

    await pb.create
      .collection('refresh_tokens')
      .data({
        token_hash: newTokenHash,
        family: params.family,
        bound_ip: params.ip,
        last_ip: params.ip,
        expires_at: expiresAt,
        revoked: false,
        last_used_at: now
      })
      .execute()
  }
}

export async function revokeFamily(family: string): Promise<void> {
  const pb = await getPB()

  const records = await pb.getFullList
    .collection('refresh_tokens')
    .filter([
      {
        field: 'family',
        operator: '=',
        value: family
      }
    ])
    .execute()

  for (const record of records) {
    await pb.update
      .collection('refresh_tokens')
      .id(record.id)
      .data({ revoked: true })
      .execute()
  }
}

export async function cleanupExpired(): Promise<void> {
  const pb = await getPB()
  const now = new Date().toISOString()

  const records = await pb.getFullList
    .collection('refresh_tokens')
    .filter([
      {
        field: 'expires_at',
        operator: '<',
        value: now
      },
      {
        field: 'revoked',
        operator: '=',
        value: false
      }
    ])
    .execute()

  for (const record of records) {
    await pb.update
      .collection('refresh_tokens')
      .id(record.id)
      .data({ revoked: true })
      .execute()
  }
}
