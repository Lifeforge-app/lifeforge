import { decrypt2 } from '@functions/auth/encryption'
import { PBService } from '@functions/database'
import { ClientError } from '@functions/routes/utils/response'
import { SCHEMAS } from '@schema'
import bcrypt from 'bcrypt'
import { z } from 'zod/v4'

export const getDecryptedMaster = async (
  pb: PBService,
  master: string,
  challenge: string
): Promise<string> => {
  const { masterPasswordHash } = pb.instance.authStore
    .record as unknown as z.infer<typeof SCHEMAS.users.users>

  const decryptedMaster = decrypt2(master, challenge)

  const isMatch = await bcrypt.compare(decryptedMaster, masterPasswordHash)

  if (!isMatch) {
    throw new ClientError('Invalid master password', 401)
  }

  return decryptedMaster
}
