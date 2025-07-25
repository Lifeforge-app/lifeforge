import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import moment from 'moment'
import { v4 } from 'uuid'
import { z } from 'zod/v4'

import { currentSession } from '..'

let currentCodeVerifier: string | null = null

const listProviders = forgeController.query
  .description('List available OAuth providers')
  .input({})
  .callback(async ({ pb }) => {
    return (
      await pb.instance.collection('users').listAuthMethods()
    ).oauth2.providers.map(e => e.name)
  })

const getEndpoint = forgeController.query
  .description('Get OAuth endpoint for a provider')
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

const verify = forgeController.mutation
  .description('Verify OAuth callback')
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
          currentSession.tokenExpireAt = moment()
            .add(5, 'minutes')
            .toISOString()
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

export default forgeRouter({
  listProviders,
  getEndpoint,
  verify
})
