import { PBService } from '@functions/database'
import { Request, Response } from 'express'
import Pocketbase from 'pocketbase'

export async function validateAuthToken(
  req: Request<unknown, unknown, unknown, unknown>,
  res: Response,
  noAuth: boolean
): Promise<boolean> {
  const bearerToken = req.headers.authorization?.split(' ')[1]

  const pb = new Pocketbase(process.env.PB_HOST)

  if (!bearerToken || req.url.startsWith('/user/auth')) {
    if (req.url === '/' || noAuth) {
      req.pb = new PBService(pb)

      return true
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
    pb.authStore.save(bearerToken, null)

    try {
      await pb.collection('users').authRefresh()
    } catch (error: any) {
      if (error.response.code === 401) {
        res.status(401).send({
          state: 'error',
          message: 'Invalid authorization credentials'
        })

        return false
      }
    }

    req.pb = new PBService(pb)

    return true
  } catch {
    res.status(500).send({
      state: 'error',
      message: 'Internal server error'
    })

    return false
  }
}
