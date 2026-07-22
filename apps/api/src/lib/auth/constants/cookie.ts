import type { Request } from 'express'

export function getCookieOptions(req: Request) {
  const secure =
    req.secure ||
    req.protocol === 'https' ||
    process.env.NODE_ENV === 'production'

  return {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    path: '/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000
  } as const
}

export function getClearCookieOptions(req: Request) {
  const secure =
    req.secure ||
    req.protocol === 'https' ||
    process.env.NODE_ENV === 'production'

  return {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    path: '/auth',
    maxAge: 0
  } as const
}
