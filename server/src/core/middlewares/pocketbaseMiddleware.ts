import { PBService } from '@functions/database'
import { NextFunction, Request, Response } from 'express'
import Pocketbase from 'pocketbase'

import { ENDPOINT_WHITELIST } from '../constants/endpointWhitelist'

if (!process.env.PB_HOST || !process.env.PB_EMAIL || !process.env.PB_PASSWORD) {
  throw new Error('Pocketbase environment variables not set')
}

const pocketbaseMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerToken = req.headers.authorization?.split(' ')[1]

  const pb = new Pocketbase(process.env.PB_HOST)

  if (process.env.NODE_ENV === 'test') {
    const pb = new Pocketbase(process.env.PB_HOST)

    await pb
      .collection('users')
      .authWithPassword(process.env.PB_EMAIL!, process.env.PB_PASSWORD!)

    req.pb = new PBService(pb)

    return next()
  }

  if (!bearerToken || req.url.startsWith('/user/auth')) {
    if (
      req.url === '/' ||
      ENDPOINT_WHITELIST.some(route => req.url.startsWith(route))
    ) {
      req.pb = new PBService(pb)
      next()

      return
    }
  }

  if (!bearerToken) {
    res.status(401).send({
      state: 'error',
      message: 'Authorization token is required'
    })

    return
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

        return
      }
    }

    req.pb = new PBService(pb)
    next()
  } catch {
    res.status(500).send({
      state: 'error',
      message: 'Internal server error'
    })
  }
}

export default pocketbaseMiddleware
