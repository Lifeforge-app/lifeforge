import chalk from 'chalk'
import crypto from 'crypto'

import { RSA_KEY_SIZE, logger } from '../constants'

let privateKey: string | null = null
let publicKey: string | null = null

export default function ensureKeysExist(): void {
  if (privateKey && publicKey) return

  logger.debug('Generating new RSA keypair...')

  const keypair = crypto.generateKeyPairSync('rsa', {
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

  privateKey = keypair.privateKey
  publicKey = keypair.publicKey

  const fingerprint = crypto
    .createHash('sha256')
    .update(publicKey)
    .digest('base64url')
    .slice(0, 12)

  logger.info(
    `RSA keypair generated (fingerprint: ${chalk.magenta(fingerprint)})`
  )
}

export function getPublicKeyPem(): string {
  if (!publicKey) ensureKeysExist()

  return publicKey!
}

export function getPrivateKeyPem(): string {
  if (!privateKey) ensureKeysExist()

  return privateKey!
}
