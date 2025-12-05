import PocketBase from 'pocketbase'
import speakeasy from 'speakeasy'

import { decrypt } from '@functions/auth/encryption'

import { currentSession } from '..'

export const verifyAppOTP = async (
  pb: PocketBase,
  otp: string
): Promise<boolean> => {
  const encryptedSecret = pb.authStore.record?.twoFASecret

  if (!encryptedSecret) {
    return false
  }

  const secret = decrypt(
    Buffer.from(encryptedSecret, 'base64'),
    process.env.MASTER_KEY!
  )

  const verified = speakeasy.totp.verify({
    secret: secret.toString(),
    encoding: 'base32',
    token: otp
  })

  if (!verified) {
    return false
  }

  return true
}

export const verifyEmailOTP = async (
  pb: PocketBase,
  otp: string
): Promise<boolean> => {
  if (!currentSession.otpId) {
    return false
  }

  const authData = await pb
    .collection('users')
    .authWithOTP(currentSession.otpId, otp)
    .catch(() => null)

  if (!authData || !pb.authStore.isValid) {
    console.error('Invalid OTP')

    return false
  }

  return true
}
