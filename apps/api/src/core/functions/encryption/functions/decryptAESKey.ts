import crypto from 'crypto'

import { getPrivateKeyPem } from './ensureKeyExists'

export default function decryptAESKey(encryptedKey: string): Buffer {
  const privateKey = getPrivateKeyPem()

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
