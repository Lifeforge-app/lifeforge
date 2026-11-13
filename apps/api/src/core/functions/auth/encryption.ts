import crypto from 'crypto'

import type { DecryptFunc, EncryptFunc } from '@lifeforge/server-utils'

const ALGORITHM = 'aes-256-gcm'
const PREFIX = 'v2:'
const IV_LENGTH = 12
const TAG_LENGTH = 16

function deriveKey(passphrase: string): Buffer {
  return crypto.createHash('sha256').update(String(passphrase)).digest()
}

const encrypt: EncryptFunc = (data: string, key: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH)

  const cipher = crypto.createCipheriv(ALGORITHM, deriveKey(key), iv)

  const ciphertext = Buffer.concat([
    cipher.update(data, 'utf8'),
    cipher.final()
  ])

  const payload = Buffer.concat([iv, cipher.getAuthTag(), ciphertext])

  return PREFIX + payload.toString('base64')
}

const decrypt: DecryptFunc = (encrypted: string, key: string): string => {
  if (!encrypted.startsWith(PREFIX)) {
    throw new Error(
      'Unsupported encrypted value. Run the crypto migration first: ' +
        'pnpm --filter @lifeforge/server migrate:crypto'
    )
  }

  const payload = Buffer.from(encrypted.slice(PREFIX.length), 'base64')

  const iv = payload.subarray(0, IV_LENGTH)

  const tag = payload.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH)

  const ciphertext = payload.subarray(IV_LENGTH + TAG_LENGTH)

  const decipher = crypto.createDecipheriv(ALGORITHM, deriveKey(key), iv)

  decipher.setAuthTag(tag)

  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final()
  ]).toString('utf8')
}

export { decrypt, encrypt }
