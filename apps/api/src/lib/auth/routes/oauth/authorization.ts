import { COOKIE_OPTIONS } from '@lib/auth/constants/cookie'
import { getPB } from '@lib/auth/constants/pb'
import forge from '@lib/auth/forge'
import { fetchUserEmail, getProvider } from '@lib/auth/utils/oauth'
import { storeRefreshToken } from '@lib/auth/utils/refreshTokenStore'
import {
  generateFamily,
  generateRefreshToken,
  signAccessToken
} from '@lib/auth/utils/tokens'
import { OAuth2Tokens, generateCodeVerifier, generateState } from 'arctic'
import z from 'zod'

import { CORS_ALLOWED_ORIGINS } from '../../../../core/routes/constants/corsAllowedOrigins'

interface PendingOAuthState {
  codeVerifier: string
  provider: string
  expiresAt: number
}

const pendingStates = new Map<string, PendingOAuthState>()

function cleanExpiredStates(): void {
  const now = Date.now()

  for (const [state, pending] of pendingStates) {
    if (pending.expiresAt < now) {
      pendingStates.delete(state)
    }
  }
}

function resolveOrigin(origin: string | undefined): string | null {
  if (origin && CORS_ALLOWED_ORIGINS.includes(origin)) return origin

  return null
}

export const authorize = forge
  .query({
    description: 'Start OAuth authorization flow',
    noAuth: true,
    encrypted: false,
    input: {
      query: z.object({
        provider: z.string()
      })
    },
    output: {
      OK: z.object({
        url: z.string(),
        state: z.string()
      }),
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ query: { provider }, req, response }) => {
    cleanExpiredStates()

    const origin = resolveOrigin(req.headers.origin)

    if (!origin) {
      return response.badRequest('Invalid origin')
    }

    const providerInstance = await getProvider(provider, origin)

    if (!providerInstance) {
      return response.badRequest('Provider not supported or not configured')
    }

    const { client, config: providerConfig } = providerInstance

    const state = generateState()
    const codeVerifier = generateCodeVerifier()

    pendingStates.set(state, {
      codeVerifier,
      provider,
      expiresAt: Date.now() + 5 * 60 * 1000
    })

    const url = providerConfig.pkce
      ? client.createAuthorizationURL(
          state,
          codeVerifier,
          providerConfig.scopes
        )
      : client.createAuthorizationURL(state, providerConfig.scopes)

    return response.ok({
      url: url.toString(),
      state
    })
  })

export const verify = forge
  .mutation({
    description: 'Verify OAuth authorization callback',
    noAuth: true,
    encrypted: false,
    input: {
      body: z.object({
        provider: z.string(),
        code: z.string(),
        state: z.string()
      })
    },
    output: {
      OK: z.object({
        accessToken: z.string()
      }),
      UNAUTHORIZED: true,
      BAD_REQUEST: z.string()
    }
  })
  .callback(
    async ({
      body: { provider: providerName, code, state },
      req,
      res,
      response
    }) => {
      cleanExpiredStates()

      const pending = pendingStates.get(state)

      if (!pending) {
        return response.badRequest('Invalid or expired state')
      }

      if (pending.provider !== providerName) {
        return response.badRequest('Provider mismatch')
      }

      pendingStates.delete(state)

      const origin = resolveOrigin(req.headers.origin)

      if (!origin) {
        return response.badRequest('Invalid origin')
      }

      const result = await getProvider(providerName, origin)

      if (!result) {
        return response.badRequest('Provider not supported or not configured')
      }

      const { client, config: providerConfig } = result

      let tokens: OAuth2Tokens

      try {
        tokens = providerConfig.pkce
          ? await client.validateAuthorizationCode(code, pending.codeVerifier)
          : await client.validateAuthorizationCode(code)
      } catch {
        return response.unauthorized()
      }

      const email = await fetchUserEmail(providerName, tokens)

      if (!email) {
        return response.unauthorized()
      }

      const pb = await getPB('user')
      const user = await pb.getFirstListItem
        .collection('users')
        .filter([
          {
            field: 'email',
            operator: '=',
            value: email
          }
        ])
        .execute()
        .catch(() => null)

      if (!user) {
        return response.unauthorized()
      }

      const ip = req.ip || req.socket.remoteAddress || '127.0.0.1'

      const jwtToken = signAccessToken(user.id)
      const refreshToken = generateRefreshToken()
      const family = generateFamily()

      await storeRefreshToken({
        token: refreshToken,
        family,
        ip
      })

      res.cookie('refresh_token', refreshToken, COOKIE_OPTIONS)

      return response.ok({ accessToken: jwtToken })
    }
  )
