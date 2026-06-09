import crypto from 'crypto'
import fs from 'fs'

import { PRIVATE_KEY_PATH } from '../constants'
import ensureKeysExist from './ensureKeyExists'

/**
 * Gets the server's private key in PEM format.
 * Used internally for decrypting client AES keys.
 */
function getPrivateKey(): string {
  if (!fs.existsSync(PRIVATE_KEY_PATH)) {
    ensureKeysExist()
  }

  return fs.readFileSync(PRIVATE_KEY_PATH, 'utf8')
}

/**
 * Decrypts an RSA-encrypted AES key using the server's private key.
 *
 * @param encryptedKey - Base64-encoded RSA-encrypted AES key
 * @returns The decrypted AES key as a Buffer
 */
export default function decryptAESKey(encryptedKey: string): Buffer {
  const privateKey = getPrivateKey()

  const keyBuffer = Buffer.from(encryptedKey, 'base64')

  return crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
    keyBuffer
  )
}
