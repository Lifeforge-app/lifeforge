import crypto from 'node:crypto'

export function generateAndWrapRecoveryVEK(vek: Buffer): {
  recovery_key: string
  recovery_wrapped_vek: string
} {
  const recoveryKey = crypto.randomBytes(32)
  const recoveryKeyHex = recoveryKey.toString('hex')

  const recoveryDerivedKey = crypto
    .createHash('sha256')
    .update(recoveryKey)
    .digest('base64')
    .slice(0, 32)

  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(recoveryDerivedKey, 'utf-8'),
    iv
  )

  const encrypted = Buffer.concat([cipher.update(vek), cipher.final()])
  const tag = cipher.getAuthTag()

  const recovery_wrapped_vek = Buffer.concat([iv, encrypted, tag]).toString(
    'base64'
  )

  return { recovery_key: recoveryKeyHex, recovery_wrapped_vek }
}
