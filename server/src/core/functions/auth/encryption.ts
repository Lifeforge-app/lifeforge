import { Decrypt2Func, DecryptFunc, Encrypt2Func, EncryptFunc } from '@lifeforge/server-utils'
import crypto from 'crypto'
import CryptoJS from 'crypto-js'

const ALGORITHM = 'aes-256-ctr'

const encrypt: EncryptFunc = (buffer: Buffer, key: string) => {
  const iv = crypto.randomBytes(16)

  key = crypto
    .createHash('sha256')
    .update(String(key))
    .digest('base64')
    .slice(0, 32)

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()])

  return result
}

const decrypt: DecryptFunc = (encrypted: Buffer, key: string) => {
  const iv = encrypted.slice(0, 16)

  encrypted = encrypted.slice(16)
  key = crypto
    .createHash('sha256')
    .update(String(key))
    .digest('base64')
    .substr(0, 32)

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)

  const result = Buffer.concat([decipher.update(encrypted), decipher.final()])

  return result
}

const encrypt2: Encrypt2Func = (message: string, key: string) =>
  CryptoJS.AES.encrypt(message, key).toString()

const decrypt2: Decrypt2Func = (encrypted: string, key: string) =>
  CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8)

export { decrypt, decrypt2, encrypt, encrypt2 }
