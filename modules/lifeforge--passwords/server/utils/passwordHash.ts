import { argon2idAsync } from '@noble/hashes/argon2.js'
import { randomBytes } from '@noble/hashes/utils.js'

const opts = { t: 3, m: 65536, p: 4, dkLen: 32 }

function uint8ArrayToBase64NoPadding(buf: Uint8Array): string {
  return Buffer.from(buf).toString('base64').replace(/=+$/, '')
}

function base64NoPaddingToUint8Array(str: string): Uint8Array {
  const padded = str + '='.repeat((4 - (str.length % 4)) % 4)

  return new Uint8Array(Buffer.from(padded, 'base64'))
}

export async function hash(password: string): Promise<string> {
  const salt = randomBytes(16)
  const hashBytes = await argon2idAsync(password, salt, opts)
  const saltB64 = uint8ArrayToBase64NoPadding(salt)
  const hashB64 = uint8ArrayToBase64NoPadding(hashBytes)

  return `$argon2id$v=19$m=${opts.m},t=${opts.t},p=${opts.p}$${saltB64}$${hashB64}`
}

export async function verify(
  password: string,
  encodedHash: string
): Promise<boolean> {
  if (!encodedHash.startsWith('$argon2id$')) return false

  const parts = encodedHash.split('$')
  const saltB64 = parts[4]
  const expectedHashB64 = parts[5]

  const salt = base64NoPaddingToUint8Array(saltB64)
  const expectedHash = base64NoPaddingToUint8Array(expectedHashB64)

  const hashBytes = await argon2idAsync(password, salt, opts)

  if (hashBytes.length !== expectedHash.length) return false

  for (let i = 0; i < hashBytes.length; i++) {
    if (hashBytes[i] !== expectedHash[i]) return false
  }

  return true
}
