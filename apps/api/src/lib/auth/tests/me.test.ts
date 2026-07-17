import { cleanupTestTokens, initAuthTests } from '@tests/e2e-setup'
import { expectNo2FA, forgeAPI, unwrap } from '@tests/utils'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { clearAccessToken, setAccessToken } from '@lifeforge/api'

let email = ''
let password = ''

beforeAll(async () => {
  const creds = await initAuthTests()
  email = creds.email
  password = creds.password
})

function creds() {
  return { email, password }
}

afterAll(cleanupTestTokens)

describe('GET /auth/me', () => {
  it('returns 200 with userData when authenticated', async () => {
    const login = await forgeAPI.auth.login.mutateRaw(creds(), { raw: true })
    setAccessToken(expectNo2FA(unwrap(login)).accessToken)

    const res = await forgeAPI.auth.me.queryRaw({ raw: true })
    const data = unwrap(res)

    expect(res.status).toBe(200)
    expect(data.userData).toBeTruthy()
  })

  it('returns 401 when no Bearer token is sent', async () => {
    clearAccessToken()

    const res = await forgeAPI.auth.me.queryRaw({ raw: true })

    expect(res.status).toBe(401)
    expect((res.data as any).state).toBe('error')
  })

  it('returns 401 with an invalid Bearer token', async () => {
    setAccessToken('invalid.token.here')

    const res = await forgeAPI.auth.me.queryRaw({ raw: true })

    expect(res.status).toBe(401)

    clearAccessToken()
  })

  it('userData excludes sensitive fields', async () => {
    const login = await forgeAPI.auth.login.mutateRaw(creds(), { raw: true })
    setAccessToken(expectNo2FA(unwrap(login)).accessToken)

    const me = await forgeAPI.auth.me.queryRaw({ raw: true })
    const userData = unwrap(me).userData

    expect(userData).not.toHaveProperty('auth_password_hash')
    expect(userData).not.toHaveProperty('twoFASecret')
    expect(userData).not.toHaveProperty('APIKeysMasterPasswordHash')
    expect(userData).not.toHaveProperty('password')
  })

  it('userData contains required public fields', async () => {
    const login = await forgeAPI.auth.login.mutateRaw(creds(), { raw: true })
    setAccessToken(expectNo2FA(unwrap(login)).accessToken)

    const me = await forgeAPI.auth.me.queryRaw({ raw: true })
    const userData = unwrap(me).userData

    expect(userData).toHaveProperty('id')
    expect(userData).toHaveProperty('collectionId')
    expect(userData).toHaveProperty('email')
    expect(userData).toHaveProperty('username')
    expect(userData).toHaveProperty('name')
    expect(userData).toHaveProperty('theme')
    expect(userData).toHaveProperty('language')
    expect(userData).toHaveProperty('dashboardLayout')
    expect(userData).toHaveProperty('verified')
    expect(userData).toHaveProperty('twoFAEnabled')
    expect(userData).toHaveProperty('hasAPIKeysMasterPassword')
  })
})
