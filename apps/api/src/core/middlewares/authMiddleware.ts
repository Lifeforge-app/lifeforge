import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SIGNING_KEY!

function isAuthTokenValid(
  req: Request<unknown, unknown, unknown, unknown>,
  res: Response,
  noAuth: boolean
): boolean {
  if (req.url === '/' || noAuth) {
    return true
  }

  const bearerToken = req.headers.authorization?.split(' ')[1]

  if (!bearerToken) {
    res.status(401).send({
      state: 'error',
      message: 'Authorization token is required'
    })

    return false
  }

  try {
    jwt.verify(bearerToken, JWT_SECRET, { algorithms: ['HS512'] })
  } catch {
    res.status(401).send({
      state: 'error',
      message: 'Invalid authorization credentials'
    })

    return false
  }

  return true
}

/**
 * Runs authentication before the upload middleware so nothing is staged for
 * unauthenticated requests.
 */
export default function authMiddleware(noAuth: boolean) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (isAuthTokenValid(req, res, noAuth)) {
      next()
    }
  }
}
