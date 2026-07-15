import { decrypt } from '@functions/auth/encryption'
import { OAuth2Tokens } from 'arctic'

import {
  OAUTH_PROVIDER_CONFIGS,
  ProviderConfig
} from '../constants/oauth_providers'
import { getPB } from '../constants/pb'

const MASTER_KEY = process.env.MASTER_KEY!

export async function getProvider(
  providerName: string,
  origin: string
): Promise<{
  client: any
  redirectUri: string
  config: ProviderConfig
} | null> {
  const pb = await getPB()

  const record = await pb.getFirstListItem
    .collection('oauth_providers')
    .filter([
      {
        field: 'provider',
        operator: '=',
        value: providerName
      },
      {
        field: 'enabled',
        operator: '=',
        value: true
      }
    ])
    .execute()
    .catch(() => null)

  if (!record) {
    return null
  }

  let clientId, clientSecret: string

  try {
    clientId = decrypt(
      Buffer.from(record.client_id, 'base64'),
      MASTER_KEY
    ).toString('utf-8')

    clientSecret = decrypt(
      Buffer.from(record.client_secret, 'base64'),
      MASTER_KEY
    ).toString('utf-8')
  } catch {
    return null
  }

  const providerConfig = OAUTH_PROVIDER_CONFIGS[record.provider]

  const redirectUri = `${origin}/auth`

  return {
    client: new providerConfig.client(clientId, clientSecret, redirectUri),
    redirectUri,
    config: providerConfig
  }
}

export async function fetchUserEmail(
  provider: string,
  tokens: OAuth2Tokens
): Promise<string | null> {
  const config = OAUTH_PROVIDER_CONFIGS[provider]

  if (!config) return null

  if (config.emailStrategy === 'id_token') {
    const idToken = tokens.idToken()
    const payload = JSON.parse(
      Buffer.from(idToken.split('.')[1], 'base64').toString('utf-8')
    )

    return payload.email || null
  }

  if (!config.userinfoUrl || !config.extractEmail) return null

  const accessToken = tokens.accessToken()
  const res = await fetch(config.userinfoUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })

  if (!res.ok) return null

  const data = await res.json()

  return config.extractEmail(data)
}
