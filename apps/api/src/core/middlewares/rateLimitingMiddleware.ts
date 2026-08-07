import rateLimit from 'express-rate-limit'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SIGNING_KEY!

const disabledRoutes = new Set<string>()

function normalizePath(p: string): string {
  let normalized = p.trim().toLowerCase()

  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }

  return normalized
}

export function disableRateLimitForRoute(method: string, path: string): void {
  const normalizedPath = normalizePath(path)
  disabledRoutes.add(`${method.toLowerCase()}:${normalizedPath}`)
}

export default rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 250,
  skip: async req => {
    const reqMethod = req.method.toLowerCase()
    const reqPath = normalizePath(req.path)

    if (disabledRoutes.has(`${reqMethod}:${reqPath}`)) {
      return true
    }

    if (req.path.trim().startsWith('/modules')) {
      return true
    }

    const bearerToken = req.headers.authorization?.split(' ')[1]

    if (!bearerToken) {
      return false
    }

    try {
      jwt.verify(bearerToken, JWT_SECRET, { algorithms: ['HS512'] })

      return true
    } catch {
      return false
    }
  },
  validate: { xForwardedForHeader: false }
})
