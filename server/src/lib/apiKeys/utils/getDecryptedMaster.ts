import bcrypt from 'bcryptjs'

import { decrypt2 } from '@functions/auth/encryption'
import { PBService } from '@functions/database'
import { ClientError } from '@functions/routes/utils/response'

import { challenge } from '..'

export default async function getDecryptedMaster(
  pb: PBService,
  userId: string,
  master: string
): Promise<string> {
  if (!userId) {
    throw new ClientError('User not authenticated', 401)
  }

  const user = await pb.getOne.collection('user__users').id(userId).execute()

  const { APIKeysMasterPasswordHash } = user

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
