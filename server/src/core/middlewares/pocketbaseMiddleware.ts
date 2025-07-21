import { NextFunction, Request, Response } from 'express'
import Pocketbase from 'pocketbase'

import { ENDPOINT_WHITELIST } from '../constants/endpointWhitelist'
import { ALLOWED_LANG, ALLOWED_NAMESPACE } from '../constants/locales'

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
    req.pb = new Pocketbase(process.env.PB_HOST)
    await req.pb
      .collection('users')
      .authWithPassword(process.env.PB_EMAIL!, process.env.PB_PASSWORD!)

    return next()
  }

  if (!bearerToken || req.url.startsWith('/user/auth')) {
    if (
      req.url === '/' ||
      ENDPOINT_WHITELIST.some(route => req.url.startsWith(route)) ||
      new RegExp(
        `\/locales\/(?:${ALLOWED_LANG.join('|')})\/(?:${ALLOWED_NAMESPACE.join('|')})(\..+)?$`
      ).test(req.url)
    ) {
      req.pb = pb
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

    req.pb = pb
    next()
  } catch {
    res.status(500).send({
      state: 'error',
      message: 'Internal server error'
    })
  }
}

export default pocketbaseMiddleware
