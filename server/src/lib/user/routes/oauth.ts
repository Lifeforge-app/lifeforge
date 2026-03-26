import { ClientError } from '@lifeforge/server-utils'
import dayjs from 'dayjs'
import { v4 } from 'uuid'
import z from 'zod'

import { createLogger } from '@lifeforge/log'

import { currentSession, oauthStates } from '..'
import forge from '../forge'

const logger = createLogger({ name: 'oauth' })

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

    // Generate a state token to track this OAuth flow
    const stateToken = v4()

    // Store codeVerifier per-state instead of globally
    oauthStates.set(stateToken, {
      codeVerifier: endpoint.codeVerifier,
      provider: endpoint.name,
      expiresAt: dayjs().add(10, 'minutes').toISOString()
    })

    // Return state token to client for use in verify step
    return {
      ...endpoint,
      state: stateToken
    }
  })

export const verify = forge
  .mutation()
  .noAuth()
  .description('Verify OAuth authorization callback')
  .input({
    body: z.object({
      provider: z.string(),
      code: z.string(),
      state: z.string() // State token from getEndpoint
    })
  })
  .callback(async ({ req, pb, body: { provider: providerName, code, state } }) => {
    const oauthState = oauthStates.get(state)

    if (!oauthState) {
      throw new ClientError('Invalid or expired OAuth session', 400)
    }

    if (dayjs().isAfter(dayjs(oauthState.expiresAt))) {
      oauthStates.delete(state)
      throw new ClientError('OAuth session expired. Please start over.', 400)
    }

    if (oauthState.provider !== providerName) {
      throw new ClientError('Provider mismatch', 400)
    }

    const providers = await pb.instance.collection('users').listAuthMethods()

    const provider = providers.oauth2.providers.find(
      item => item.name === providerName
    )

    if (!provider) {
      throw new ClientError('Invalid login attempt')
    }

    try {
      const authData = await pb.instance
        .collection('users')
        .authWithOAuth2Code(
          provider.name,
          code,
          oauthState.codeVerifier,
          `${req.headers.origin}/auth`,
          {
            emailVisibility: false
          }
        )

      // Clean up OAuth state after successful authentication
      oauthStates.delete(state)

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
      logger.error('OAuth verification failed', {
        error: err instanceof Error ? err.message : String(err),
        provider: providerName
      })
      throw new ClientError('Invalid credentials', 401)
    }
  })
