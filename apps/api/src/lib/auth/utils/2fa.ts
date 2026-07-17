import { createCache } from '@functions/cache'
import { v4 } from 'uuid'

export const pendingTOTPSetups = createCache<{ secret: string }>(
  'totp-setups',
  {
    stdTTL: 300
  }
)

export const pending2FASessions = createCache<{ userId: string }>(
  '2fa-sessions',
  { stdTTL: 300 }
)

export async function create2FASession(userId: string): Promise<string> {
  const tid = v4()

  pending2FASessions.set(tid, { userId })

  return tid
}
