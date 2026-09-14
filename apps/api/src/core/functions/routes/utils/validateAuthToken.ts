import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SIGNING_KEY!

export default async function isAuthTokenValid(
  req: Request<unknown, unknown, unknown, unknown>,
  res: Response,
  noAuth: boolean
): Promise<boolean> {
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
