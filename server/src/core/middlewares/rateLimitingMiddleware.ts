import rateLimit from 'express-rate-limit'
import Pocketbase from 'pocketbase'

export default rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 250,
  skip: async req => {
    if (
      req.path.startsWith('/media/') ||
      [
        '/code-time/user/minutes',
        '/code-time/eventLog',
        '/user/passkey/challenge',
        '/user/passkey/login',
        '/user/auth/verify',
        '/user/auth/login',
        '/books-library/cover',
        '/status',
        '/youtube-videos/video/thumbnail'
      ].some(route => req.path.trim().startsWith(route))
    ) {
      return true
    }

    const bearerToken = req.headers.authorization?.split(' ')[1]

    const pb = new Pocketbase(process.env.PB_HOST)

    if (!bearerToken) {
      return false
    }

    try {
      pb.authStore.save(bearerToken, null)

      try {
        await pb.collection('users').authRefresh()

        return true
      } catch (error: any) {
        if (error.response.code === 401) {
          return false
        }
      }
    } catch {
      return false
    }

    return false
  },
  validate: { xForwardedForHeader: false }
})
