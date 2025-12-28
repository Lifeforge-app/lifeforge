import rateLimit from 'express-rate-limit'

import { verifyToken } from '@functions/auth/jwt'

export default rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 250,
  skip: async req => {
    if (
      req.path.startsWith('/media') ||
      [
        '/code-time/user/minutes',
        '/code-time/eventLog',
        '/user/passkey/challenge',
        '/user/passkey/login',
        '/user/auth/verify',
        '/user/auth/login',
        '/books-library/cover',
        '/status',
        '/youtube-videos/video/thumbnail',
        '/locales'
      ].some(route => req.path.trim().startsWith(route))
    ) {
      return true
    }

    const bearerToken = req.headers.authorization?.split(' ')[1]

    if (!bearerToken) {
      return false
    }

    try {
      verifyToken(bearerToken)

      return true
    } catch {
      return false
    }
  },
  validate: { xForwardedForHeader: false }
})
