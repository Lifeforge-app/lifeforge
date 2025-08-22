import forgeAPI from '@utils/forgeAPI'

import { decrypt, encrypt } from '../../../core/utils/encryption'

export async function getDecryptedPassword(
  masterPassword: string,
  id: string
): Promise<string> {
  const challenge = await forgeAPI.passwords.entries.getChallenge.query()

  const encryptedMaster = encrypt(masterPassword, challenge)

  const decrypted = await forgeAPI.passwords.entries.decrypt
    .input({
      id,
      master: encryptedMaster
    })
    .mutate({})

  return decrypt(decrypted, challenge)
}
