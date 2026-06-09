import fs from 'fs'

import { PUBLIC_KEY_PATH } from '../constants'
import ensureKeysExist from './ensureKeyExists'

/**
 * Gets the server's public key in PEM format.
 * This should be exposed to clients for encrypting their AES keys.
 */
export default function getPublicKey(): string {
  if (!fs.existsSync(PUBLIC_KEY_PATH)) {
    ensureKeysExist()
  }

  return fs.readFileSync(PUBLIC_KEY_PATH, 'utf8')
}
