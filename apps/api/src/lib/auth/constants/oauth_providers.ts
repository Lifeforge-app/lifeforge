import { GitHub, Google } from 'arctic'
import type { OAuth2Tokens } from 'arctic'

type GithubEmail = {
  email: string
  primary: boolean
  verified: boolean
}

export interface OAuthClient {
  createAuthorizationURL(state: string, ...rest: unknown[]): URL
  validateAuthorizationCode(
    code: string,
    ...rest: unknown[]
  ): Promise<OAuth2Tokens>
}

export interface ProviderConfig {
  name: string
  icon: string
  client: typeof Google | typeof GitHub
  scopes: string[]
  pkce: boolean
  emailStrategy: 'id_token' | 'api'
  userinfoUrl?: string
  extractEmail?: (data: unknown) => string | null
}

export const OAUTH_PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
  google: {
    name: 'Google',
    icon: 'tabler:brand-google',
    client: Google,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    emailStrategy: 'id_token'
  },
  github: {
    name: 'GitHub',
    icon: 'tabler:brand-github',
    client: GitHub,
    scopes: ['user:email'],
    pkce: false,
    emailStrategy: 'api',
    userinfoUrl: 'https://api.github.com/user/emails',
    extractEmail: (data: unknown) => {
      const emails = data as GithubEmail[]

      const primary = emails.find(e => e.primary && e.verified)

      return primary?.email || null
    }
  }
} as const satisfies Record<string, ProviderConfig>
