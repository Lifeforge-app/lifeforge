import { v4 } from 'uuid'

export const pendingTOTPSetups = new Map<
  string,
  { secret: string; expiresAt: number }
>()

export const pending2FASessions = new Map<
  string,
  { userId: string; expiresAt: number }
>()

export function cleanExpired2FASessions(): void {
  const now = Date.now()

  for (const [key, pending] of pendingTOTPSetups) {
    if (pending.expiresAt < now) pendingTOTPSetups.delete(key)
  }

  for (const [key, pending] of pending2FASessions) {
    if (pending.expiresAt < now) pending2FASessions.delete(key)
  }
}

export async function create2FASession(userId: string): Promise<string> {
  cleanExpired2FASessions()

  const tid = v4()

  pending2FASessions.set(tid, {
    userId,
    expiresAt: Date.now() + 5 * 60 * 1000
  })

  return tid
}
