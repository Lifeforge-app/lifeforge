import { Request, Response } from 'express'

import { type DecodedToken, verifyToken } from '@functions/auth/jwt'
import { createPBServiceForUser } from '@functions/auth/pbBridge'

export async function isAuthTokenValid(
  req: Request<unknown, unknown, unknown, unknown>,
  res: Response,
  noAuth: boolean
): Promise<boolean> {
  const bearerToken = req.headers.authorization?.split(' ')[1]

  if (!bearerToken || req.url.startsWith('/user/auth')) {
    if (req.url === '/' || noAuth) {
      try {
        req.pb = await createPBServiceForUser()

        return true
      } catch {
        res.status(500).send({
          state: 'error',
          message: 'Failed to connect to database'
        })

        return false
      }
    }
  }

  if (!bearerToken) {
    res.status(401).send({
      state: 'error',
      message: 'Authorization token is required'
    })

    return false
  }

  try {
    const decoded: DecodedToken = verifyToken(bearerToken)

    req.jwtPayload = decoded
    req.pb = await createPBServiceForUser()

    return true
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).send({
          state: 'error',
          message: 'Token expired'
        })
      } else if (error.name === 'JsonWebTokenError') {
        res.status(401).send({
          state: 'error',
          message: 'Invalid authorization credentials'
        })
      } else {
        res.status(500).send({
          state: 'error',
          message: 'Internal server error'
        })
      }
    } else {
      res.status(500).send({
        state: 'error',
        message: 'Internal server error'
      })
    }

    return false
  }
}
