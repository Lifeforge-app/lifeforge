import dayjs from 'dayjs'
import { v4 } from 'uuid'
import z from 'zod'

import { currentSession } from '..'
import forge from '../forge'

let currentCodeVerifier: string | null = null

export const listProviders = forge
  .query({
    description: 'Retrieve available OAuth providers',
    noAuth: true,
    encrypted: false,
    input: {},
    output: {
      OK: z.array(z.string())
    }
  })
  .callback(async ({ pb, response }) => {
    return response.ok(
      (
        await pb.instance.collection('users').listAuthMethods()
      ).oauth2.providers.map(e => e.name)
    )
  })

export const getEndpoint = forge
  .query({
    description: 'Get OAuth authorization URL for provider',
    noAuth: true,
    encrypted: false,
    input: {
      query: z.object({
        provider: z.string()
      })
    },
    output: {
      OK: z.any(),
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ pb, query: { provider }, response }) => {
    const oauthEndpoints = await pb.instance
      .collection('users')
      .listAuthMethods()

    const endpoint = oauthEndpoints.oauth2.providers.find(
      item => item.name === provider
    )

    if (!endpoint) {
      return response.badRequest('Invalid provider')
    }

    currentCodeVerifier = endpoint.codeVerifier

    return response.ok(endpoint)
  })

export const verify = forge
  .mutation({
    description: 'Verify OAuth authorization callback',
    noAuth: true,
    input: {
      body: z.object({
        provider: z.string(),
        code: z.string()
      })
    },
    output: {
      OK: z.union([
        z.object({
          state: z.literal('2fa_required'),
          tid: z.string()
        }),
        z.string()
      ]),
      UNAUTHORIZED: true,
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ req, pb, body: { provider: providerName, code }, response }) => {
    const providers = await pb.instance.collection('users').listAuthMethods()

    const provider = providers.oauth2.providers.find(
      item => item.name === providerName
    )

    if (!provider || !currentCodeVerifier) {
      return response.badRequest('Invalid login attempt')
    }

    try {
      const authData = await pb.instance
        .collection('users')
        .authWithOAuth2Code(
          provider.name,
          code,
          currentCodeVerifier,
          `${req.headers.origin}/auth`,
          {
            emailVisibility: false
          }
        )

      if (authData) {
        if (pb.instance.authStore.record?.twoFASecret) {
          currentSession.token = pb.instance.authStore.token
          currentSession.tokenExpireAt = dayjs().add(5, 'minutes').toISOString()
          currentSession.tokenId = v4()

          return response.ok({
            state: '2fa_required',
            tid: currentSession.tokenId
          })
        }

        return response.ok(pb.instance.authStore.token)
      } else {
        return response.unauthorized()
      }
    } catch {
      return response.unauthorized()
    } finally {
      currentCodeVerifier = null
    }
  })