import crypto from 'crypto'

import { ClientError } from '@functions/routes/utils/response'

import { AES_ALGORITHM } from '../constants'
import { EncryptedPayload } from '../types'
import decryptAESKey from './decryptAESKey'

/**
 * Validates if a payload is an encrypted payload structure.
 */
export function isEncryptedPayload(
  payload: unknown
): payload is EncryptedPayload {
  if (typeof payload !== 'object' || payload === null) return false

  const p = payload as Record<string, unknown>

  return (
    typeof p.k === 'string' &&
    typeof p.iv === 'string' &&
    typeof p.data === 'string' &&
    typeof p.tag === 'string'
  )
}

/**
 * Decrypts AES-GCM encrypted data using the provided key.
 *
 * @param encryptedData - Base64-encoded encrypted data
 * @param key - The AES key as a Buffer
 * @param iv - Base64-encoded initialization vector
 * @param authTag - Base64-encoded authentication tag
 * @returns The decrypted plaintext string
 */
function decryptAESData(
  encryptedData: string,
  key: Buffer,
  iv: string,
  authTag: string
): string {
  const ivBuffer = Buffer.from(iv, 'base64')

  const dataBuffer = Buffer.from(encryptedData, 'base64')

  const tagBuffer = Buffer.from(authTag, 'base64')

  const decipher = crypto.createDecipheriv(AES_ALGORITHM, key, ivBuffer)

  decipher.setAuthTag(tagBuffer)

  let decrypted = decipher.update(dataBuffer, undefined, 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

/**
 * Decrypts a complete encrypted payload from the client.
 *
 * @param payload - The encrypted payload containing k, iv, data, and tag
 * @returns The decrypted data as a parsed object
 */
export default function decryptPayload<T = unknown>(payload: unknown): T {
  if (!isEncryptedPayload(payload)) {
    return payload as unknown as T
  }

  try {
    // Step 1: Decrypt the AES key using RSA private key
    const aesKey = decryptAESKey(payload.k)

    // Step 2: Decrypt the data using AES key
    const decryptedJson = decryptAESData(
      payload.data,
      aesKey,
      payload.iv,
      payload.tag
    )

    // Step 3: Parse and return the decrypted data
    return JSON.parse(decryptedJson) as T
  } catch {
    throw new ClientError('Failed to decrypt payload', 400)
  }
}
