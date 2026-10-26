import { generate } from 'otplib'
import { describe, expect, it } from 'vitest'

import { createTOTPSecret, verifyTOTP } from '../utils/2fa'

describe('TOTP', () => {
  it('creates a base32 secret', () => {
    const secret = createTOTPSecret()

    expect(secret).toMatch(/^[A-Z2-7]+$/)
    expect(secret.length).toBeGreaterThan(32)
  })

  it('accepts a token generated from the same secret', async () => {
    const secret = createTOTPSecret()

    const token = await generate({ secret })

    expect(await verifyTOTP(secret, token)).toBe(true)
  })

  it('rejects a token generated from a different secret', async () => {
    const secret = createTOTPSecret()

    const token = await generate({ secret: createTOTPSecret() })

    expect(await verifyTOTP(secret, token)).toBe(false)
  })

  it('rejects a malformed token', async () => {
    const secret = createTOTPSecret()

    expect(await verifyTOTP(secret, '000000')).toBe(false)
  })
})
