import { createCache } from '@functions/cache'
import { PBService } from '@functions/database'
import { connectToPocketBase, validateEnvironmentVariables } from '@functions/database/dbUtils'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import Pocketbase from 'pocketbase'

const JWT_SECRET = process.env.JWT_SIGNING_KEY!

const superUserPBCache = createCache<Pocketbase>('superuser-pb', { stdTTL: 3600 })

async function getSuperUserPB(): Promise<Pocketbase> {
  const cached = superUserPBCache.get('instance')

  if (cached) return cached

  const pb = await connectToPocketBase(validateEnvironmentVariables())

  superUserPBCache.set('instance', pb)

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
