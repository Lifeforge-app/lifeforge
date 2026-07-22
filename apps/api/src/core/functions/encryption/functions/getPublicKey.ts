import { getPublicKeyPem } from './ensureKeyExists'

export default function getPublicKey(): string {
  return getPublicKeyPem()
}
