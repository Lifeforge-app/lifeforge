import { decrypt, encrypt } from '@security/utils/encryption'
import forgeAPI from '@utils/forgeAPI'

import type { APIKeysEntry } from '../components/ContentContainer'

export default async function decryptKey({
  entry,
  masterPassword
}: {
  entry: APIKeysEntry
  masterPassword: string
}) {
  const challenge = await forgeAPI.apiKeys.auth.getChallenge.query()

  const key = await forgeAPI.apiKeys.entries.decrypt
    .input({
      id: entry.id,
      master: encrypt(masterPassword, challenge)
    })
    .query()

  return decrypt(decrypt(key, challenge), masterPassword)
}
