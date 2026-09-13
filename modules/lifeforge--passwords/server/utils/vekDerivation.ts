import crypto from 'node:crypto'
import { promisify } from 'node:util'

const pbkdf2Async = promisify(crypto.pbkdf2)

export const PBKDF2_ITERATIONS = 600_000

export const PBKDF2_KEY_LENGTH = 32

export const SALT_BYTES = 16

export const WRAPPED_VEK_DELIMITER = '$'

export function generateVEKSalt(): string {
  return crypto.randomBytes(SALT_BYTES).toString('base64')
}

export function generateVEKSaltBytes(): Uint8Array {
  return crypto.randomBytes(SALT_BYTES)
}

export async function deriveWrappingKey(
  masterPassword: string,
  saltBase64: string
): Promise<Buffer> {
  const salt = Buffer.from(saltBase64, 'base64')

  return pbkdf2Async(
    masterPassword,
    salt,
    PBKDF2_ITERATIONS,
    PBKDF2_KEY_LENGTH,
    'sha256'
  )
}

export function packWrappedVEK(
  saltBase64: string,
  encryptedDataBase64: string
): string {
  return saltBase64 + WRAPPED_VEK_DELIMITER + encryptedDataBase64
}

export function unpackWrappedVEK(wrappedVEK: string): {
  saltBase64: string
  encryptedDataBase64: string
} {
  const delimiterIndex = wrappedVEK.indexOf(WRAPPED_VEK_DELIMITER)
  const saltBase64 = wrappedVEK.slice(0, delimiterIndex)
  const encryptedDataBase64 = wrappedVEK.slice(delimiterIndex + 1)

  return { saltBase64, encryptedDataBase64 }
}

export function encryptVEKWithKey(vek: Buffer, derivedKey: Buffer): string {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, iv)

  const encrypted = Buffer.concat([cipher.update(vek), cipher.final()])
  const tag = cipher.getAuthTag()

  return Buffer.concat([iv, encrypted, tag]).toString('base64')
}

export function decryptVEKWithKey(
  encryptedDataBase64: string,
  derivedKey: Buffer
): Buffer {
  const data = Buffer.from(encryptedDataBase64, 'base64')
  const iv = data.subarray(0, 12)
  const ciphertext = data.subarray(12)
  const decipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, iv)

  decipher.setAuthTag(ciphertext.subarray(-16))

  return Buffer.concat([
    decipher.update(ciphertext.subarray(0, -16)),
    decipher.final()
  ])
}
