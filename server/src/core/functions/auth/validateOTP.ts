import { PBService } from '@functions/database'

import { decrypt2 } from './encryption'

async function validateOTP(
  pb: PBService,
  {
    otp,
    otpId
  }: {
    otp: string
    otpId: string
  },
  challenge?: string
): Promise<boolean> {
  const id = pb.instance.authStore.record?.id

  if (!id) {
    return false
  }

  let decryptedOTP

  if (challenge) {
    decryptedOTP = decrypt2(otp, challenge)
  } else {
    decryptedOTP = otp
  }

  const authData = await pb.instance
    .collection('users')
    .authWithOTP(otpId, decryptedOTP)
    .catch(() => null)

  if (!authData || !pb.instance.authStore.isValid) {
    return false
  }

  pb.instance.authStore.clear()

  return true
}

export default validateOTP
