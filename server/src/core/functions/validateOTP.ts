import PocketBase from 'pocketbase'

import { decrypt2 } from './encryption'

export default async (
  pb: PocketBase,
  {
    otp,
    otpId
  }: {
    otp: string
    otpId: string
  },
  challenge?: string
): Promise<boolean> => {
  const id = pb.authStore.record?.id

  if (!id) {
    return false
  }

  let decryptedOTP

  if (challenge) {
    decryptedOTP = decrypt2(otp, challenge)
  } else {
    decryptedOTP = otp
  }

  const authData = await pb
    .collection('users')
    .authWithOTP(otpId, decryptedOTP)
    .catch(() => null)

  if (!authData || !pb.authStore.isValid) {
    return false
  }

  pb.authStore.clear()
  return true
}
