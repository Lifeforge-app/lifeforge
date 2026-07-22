import { PBService } from '@functions/database'
import { connectToPocketBase, validateEnvironmentVariables } from '@functions/database/dbUtils'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import Pocketbase from 'pocketbase'

const JWT_SECRET = process.env.JWT_SIGNING_KEY!

let pbCache: { pb: Pocketbase; expiresAt: number } | null = null

async function getSuperUserPB(): Promise<Pocketbase> {
  const now = Date.now()

  if (pbCache && pbCache.expiresAt > now) {
    return pbCache.pb
  }

  const pb = await connectToPocketBase(validateEnvironmentVariables())

  pbCache = { pb, expiresAt: now + 60 * 60 * 1000 }

  return pb
}

export default async function isAuthTokenValid(
  req: Request<unknown, unknown, unknown, unknown>,
  res: Response,
  noAuth: boolean
): Promise<boolean> {
  if (req.url === '/' || noAuth) {
    const pb = await getSuperUserPB()

    req.pb = (module: { id: string }) => new PBService(pb, module)

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

  const pb = await getSuperUserPB()

  req.pb = (module: { id: string }) => new PBService(pb, module)

  return true
}
