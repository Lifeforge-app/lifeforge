import { cleanupTestTokens, initAuthTests } from '@tests/e2e-setup'
import { expectNo2FA, extractCookies, forgeAPI, unwrap } from '@tests/utils'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { setAccessToken } from '@lifeforge/api'

let email = ''
let password = ''

beforeAll(async () => {
  const creds = await initAuthTests()
  email = creds.email
  password = creds.password
}, 60000)

function creds() {
  return { email, password }
}

afterAll(cleanupTestTokens)

describe('POST /auth/login', () => {
  it('returns 200, accessToken and sets cookie for valid credentials', async () => {
    const res = await forgeAPI.auth.login.mutateRaw(creds(), { raw: true })
    const data = expectNo2FA(unwrap(res))

    expect(res.status).toBe(200)
    expect(data).toHaveProperty('accessToken')
    expect(typeof data.accessToken).toBe('string')
    expect(data.accessToken.length).toBeGreaterThan(0)

    const cookies = extractCookies(res.headers['set-cookie'])
    expect(cookies).toBeTruthy()
    expect(cookies).toContain('refresh_token=')
  })

  it('returns the correct user data via /auth/me after login', async () => {
    const login = await forgeAPI.auth.login.mutateRaw(creds(), { raw: true })
    setAccessToken(expectNo2FA(unwrap(login)).accessToken)

    const meRes = await forgeAPI.auth.me.queryRaw({ raw: true })
    const meData = unwrap(meRes)

    expect(meRes.status).toBe(200)
    expect(meData.userData).toMatchObject({
      email,
      username: (meData as any).userData.username,
      name: (meData as any).userData.name
    })
  })

  it('returns 401 for wrong email', async () => {
    const res = await forgeAPI.auth.login.mutateRaw(
      { email: 'wrong@lifeforge.test', password },
      { raw: true }
    )

    expect(res.status).toBe(401)
    expect((res.data as any).state).toBe('error')
  })

  it('returns 401 for wrong password', async () => {
    const res = await forgeAPI.auth.login.mutateRaw(
      { email, password: 'WrongPass999!' },
      { raw: true }
    )

    expect(res.status).toBe(401)
    expect((res.data as any).state).toBe('error')
  })

  it('returns 401 for non-existent user', async () => {
    const res = await forgeAPI.auth.login.mutateRaw(
      { email: 'no-such-user@lifeforge.test', password },
      { raw: true }
    )

    expect(res.status).toBe(401)
  })

  it('returns 400 for missing email field', async () => {
    const res = await forgeAPI.auth.login.mutateRaw({ password } as any, {
      raw: true
    })

    expect(res.status).toBe(400)
  })

  it('returns 400 for missing password field', async () => {
    const res = await forgeAPI.auth.login.mutateRaw({ email } as any, {
      raw: true
    })

    expect(res.status).toBe(400)
  })

  it('returns 400 for empty email (min length 1)', async () => {
    const res = await forgeAPI.auth.login.mutateRaw(
      { email: '', password },
      { raw: true }
    )

    expect(res.status).toBe(400)
  })

  it('returns 400 for empty password (min length 1)', async () => {
    const res = await forgeAPI.auth.login.mutateRaw(
      { email, password: '' },
      { raw: true }
    )

    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid email format', async () => {
    const res = await forgeAPI.auth.login.mutateRaw(
      { email: 'not-an-email', password },
      { raw: true }
    )

    expect(res.status).toBe(400)
  })

  it('returns 400 for SQL injection in email (invalid format)', async () => {
    const res = await forgeAPI.auth.login.mutateRaw(
      { email: "' OR 1=1 --", password },
      { raw: true }
    )

    expect(res.status).toBe(400)
  })

  it('multiple logins produce independently valid tokens', async () => {
    const login1 = await forgeAPI.auth.login.mutateRaw(creds(), { raw: true })
    const login2 = await forgeAPI.auth.login.mutateRaw(creds(), { raw: true })

    setAccessToken(expectNo2FA(unwrap(login1)).accessToken)
    const me1 = await forgeAPI.auth.me.queryRaw({ raw: true })

    setAccessToken(expectNo2FA(unwrap(login2)).accessToken)
    const me2 = await forgeAPI.auth.me.queryRaw({ raw: true })

    expect(me1.status).toBe(200)
    expect(me2.status).toBe(200)
  })

  it('access token is a valid JWT (three dot-separated segments)', async () => {
    const res = await forgeAPI.auth.login.mutateRaw(creds(), { raw: true })
    const token = expectNo2FA(unwrap(res)).accessToken
    const segments = token.split('.')

    expect(segments.length).toBe(3)
    expect(() => JSON.parse(atob(segments[0]))).not.toThrow()
    expect(() => JSON.parse(atob(segments[1]))).not.toThrow()
  })

  it('cookie has httpOnly, SameSite=Lax, Path=/auth in development', async () => {
    const res = await forgeAPI.auth.login.mutateRaw(creds(), { raw: true })
    const cookieHeader = res.headers['set-cookie']
    const setCookie = Array.isArray(cookieHeader)
      ? (cookieHeader[0] ?? '')
      : (cookieHeader ?? '')

    expect(setCookie.toLowerCase()).toContain('httponly')
    expect(setCookie.toLowerCase()).toContain('samesite=lax')
    expect(setCookie).toContain('Path=/auth')
    expect(setCookie).toContain('refresh_token=')
  })
})
