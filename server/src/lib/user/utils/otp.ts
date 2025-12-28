import speakeasy from 'speakeasy'

import { decrypt } from '@functions/auth/encryption'

export const verifyAppOTP = async (
  encryptedSecret: string,
  otp: string
): Promise<boolean> => {
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

  return verified
}
