import type { Request } from 'express'

export function getCookieOptions(req: Request) {
  return {
    httpOnly: true,
    secure: req.secure || req.protocol === 'https' || process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}

export function getClearCookieOptions(req: Request) {
  return {
    httpOnly: true,
    secure: req.secure || req.protocol === 'https' || process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/auth',
    maxAge: 0
  }
}