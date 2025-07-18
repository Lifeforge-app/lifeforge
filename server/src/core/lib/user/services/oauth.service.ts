import ClientError from '@functions/ClientError'
import moment from 'moment'
import PocketBase from 'pocketbase'
import { AuthProviderInfo } from 'pocketbase'
import { v4 } from 'uuid'

import { currentSession } from '..'

let currentCodeVerifier: string | null = null

export const listOAuthProviders = async (): Promise<string[]> => {
  const pb = new PocketBase(process.env.PB_HOST)

  return (await pb.collection('users').listAuthMethods()).oauth2.providers.map(
    e => e.name
  )
}

export const getOAuthEndpoint = async (
  pb: PocketBase,
  provider: string
): Promise<AuthProviderInfo> => {
  const oauthEndpoints = await pb.collection('users').listAuthMethods()

  const endpoint = oauthEndpoints.oauth2.providers.find(
    item => item.name === provider
  )

  if (!endpoint) {
    throw new ClientError('Invalid provider')
  }

  currentCodeVerifier = endpoint.codeVerifier

  return endpoint
}

export const oauthVerify = async (
  pb: PocketBase,
  {
    provider: providerName,
    code,
    origin
  }: { provider: string; code: string; origin: string }
): Promise<string | { state: string; tid: string }> => {
  const providers = await pb.collection('users').listAuthMethods()

  const provider = providers.oauth2.providers.find(
    item => item.name === providerName
  )

  if (!provider || !currentCodeVerifier) {
    throw new ClientError('Invalid login attempt')
  }

  try {
    const authData = await pb
      .collection('users')
      .authWithOAuth2Code(
        provider.name,
        code,
        currentCodeVerifier,
        `${origin}/auth`,
        {
          emailVisibility: false
        }
      )

    if (authData) {
      if (pb.authStore.record?.twoFASecret) {
        currentSession.token = pb.authStore.token
        currentSession.tokenExpireAt = moment().add(5, 'minutes').toISOString()
        currentSession.tokenId = v4()

        return {
          state: '2fa_required',
          tid: currentSession.tokenId
        }
      }

      return pb.authStore.token
    } else {
      throw new ClientError('Invalid credentials', 401)
    }
  } catch (err) {
    console.error(err)
    throw new ClientError('Invalid credentials', 401)
  } finally {
    currentCodeVerifier = null
  }
}
