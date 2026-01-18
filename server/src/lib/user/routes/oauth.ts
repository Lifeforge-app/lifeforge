import { ClientError } from '@lifeforge/server-utils'
import dayjs from 'dayjs'
import { v4 } from 'uuid'
import z from 'zod'

import { currentSession } from '..'
import forge from '../forge'

let currentCodeVerifier: string | null = null

export const listProviders = forge
  .query()
  .noAuth()
  .noEncryption()
  .description('Retrieve available OAuth providers')
  .input({})
  .callback(async ({ pb }) => {
    return (
      await pb.instance.collection('users').listAuthMethods()
    ).oauth2.providers.map(e => e.name)
  })

export const getEndpoint = forge
  .query()
  .noAuth()
  .noEncryption()
  .description('Get OAuth authorization URL for provider')
  .input({
    query: z.object({
      provider: z.string()
    })
  })
  .callback(async ({ pb, query: { provider } }) => {
    const oauthEndpoints = await pb.instance
      .collection('users')
      .listAuthMethods()

    const endpoint = oauthEndpoints.oauth2.providers.find(
      item => item.name === provider
    )

    if (!endpoint) {
      throw new ClientError('Invalid provider')
    }

    currentCodeVerifier = endpoint.codeVerifier

    return endpoint
  })

export const verify = forge
  .mutation()
  .noAuth()
  .description('Verify OAuth authorization callback')
  .input({
    body: z.object({
      provider: z.string(),
      code: z.string()
    })
  })
  .callback(async ({ req, pb, body: { provider: providerName, code } }) => {
    const providers = await pb.instance.collection('users').listAuthMethods()

    const provider = providers.oauth2.providers.find(
      item => item.name === providerName
    )

    if (!provider || !currentCodeVerifier) {
      throw new ClientError('Invalid login attempt')
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

          return {
            state: '2fa_required',
            tid: currentSession.tokenId
          }
        }

        return pb.instance.authStore.token
      } else {
        throw new ClientError('Invalid credentials', 401)
      }
    } catch (err) {
      console.error(err)
      throw new ClientError('Invalid credentials', 401)
    } finally {
      currentCodeVerifier = null
    }
  })
