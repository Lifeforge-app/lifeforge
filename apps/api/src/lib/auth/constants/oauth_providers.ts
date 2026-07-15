import { GitHub, Google } from 'arctic'

export interface ProviderConfig {
  name: string
  icon: string
  client: any
  scopes: string[]
  pkce: boolean
  emailStrategy: 'id_token' | 'api'
  userinfoUrl?: string
  extractEmail?: (data: any) => string | null
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
    extractEmail: (data: any) => {
      const primary = data.find((e: any) => e.primary && e.verified)

      return primary?.email || null
    }
  }
} as const satisfies Record<string, ProviderConfig>
