import crypto from 'crypto'
import fs from 'fs'

import {
  KEYS_DIR,
  PRIVATE_KEY_PATH,
  PUBLIC_KEY_PATH,
  RSA_KEY_SIZE,
  logger
} from '../constants'

/**
 * Ensures the RSA keypair exists, generating if needed.
 * Should be called during server startup.
 */
export default function ensureKeysExist(): void {
  if (!fs.existsSync(KEYS_DIR)) {
    fs.mkdirSync(KEYS_DIR, { recursive: true })
  }

  if (!fs.existsSync(PRIVATE_KEY_PATH) || !fs.existsSync(PUBLIC_KEY_PATH)) {
    logger.debug('Generating new RSA keypair...')

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: RSA_KEY_SIZE,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    })

    fs.writeFileSync(PUBLIC_KEY_PATH, publicKey)
    fs.writeFileSync(PRIVATE_KEY_PATH, privateKey, { mode: 0o600 })
    logger.info('RSA keypair generated successfully')
  }
}
