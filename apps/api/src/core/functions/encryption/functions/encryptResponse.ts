import crypto from 'crypto'

import { AES_ALGORITHM, IV_LENGTH } from '../constants'
import { EncryptedResponse } from '../types'

/**
 * Encrypts data using AES-GCM with the provided key.
 *
 * @param data - The plaintext data to encrypt
 * @param key - The AES key as a Buffer
 * @returns Encrypted response with iv, data, and tag
 */
export function encryptAESData(data: string, key: Buffer): EncryptedResponse {
  const iv = crypto.randomBytes(IV_LENGTH)

  const cipher = crypto.createCipheriv(AES_ALGORITHM, key, iv)

  let encrypted = cipher.update(data, 'utf8', 'base64')
  encrypted += cipher.final('base64')

  const authTag = cipher.getAuthTag()

  return {
    iv: iv.toString('base64'),
    data: encrypted,
    tag: authTag.toString('base64')
  }
}

/**
 * Encrypts a response using the previously decrypted AES key.
 *
 * @param data - The data to encrypt
 * @param aesKey - The AES key (should be the same key used by the client)
 * @returns Encrypted response payload
 */
export default function encryptResponse<T>(
  data: T,
  aesKey: Buffer
): EncryptedResponse {
  // Handle undefined/null - convert to null for JSON serialization
  const jsonData = JSON.stringify(data ?? null)

  return encryptAESData(jsonData, aesKey)
}
