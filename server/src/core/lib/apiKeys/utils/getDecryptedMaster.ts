import { decrypt2 } from '@functions/auth/encryption'
import { PBService } from '@functions/database'
import { ClientError } from '@functions/routes/utils/response'
import bcrypt from 'bcrypt'

import { challenge } from '..'

export default async function getDecryptedMaster(
  pb: PBService,
  master: string
): Promise<string> {
  if (!pb.instance.authStore.record) {
    throw new ClientError('Auth store not initialized', 401)
  }

  const { APIKeysMasterPasswordHash } = pb.instance.authStore.record

  const decryptedMaster = decrypt2(master, challenge)

  const isMatch = await bcrypt.compare(
    decryptedMaster,
    APIKeysMasterPasswordHash
  )

  if (!isMatch) {
    throw new ClientError('Invalid master password', 401)
  }

  return decryptedMaster
}
