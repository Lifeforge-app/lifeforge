import { cleanupTestTokens, initAuthTests } from '@tests/e2e-setup'
import { extractCookies, forgeAPI, unwrap } from '@tests/utils'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

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

function loginAndCookies() {
  return forgeAPI.auth.login
    .mutateRaw(creds(), { raw: true })
    .then(res => extractCookies(res.headers['set-cookie']))
}

afterAll(cleanupTestTokens)

describe('POST /auth/logout', () => {
  it('returns 200 with cleared cookie for valid session', async () => {
    const cookies = await loginAndCookies()

    const logout = await forgeAPI.auth.logout.mutateRaw(undefined, {
      raw: true,
      headers: { Cookie: cookies }
    })

    expect(logout.status).toBe(200)
    expect(unwrap(logout)).toBe(true)
    expect(typeof extractCookies(logout.headers['set-cookie'])).toBe('string')
  })

  it('returns 401 when no cookie is sent', async () => {
    const res = await forgeAPI.auth.logout.mutateRaw(undefined, { raw: true })

    expect(res.status).toBe(401)
  })

  it('returns 401 with invalid cookie', async () => {
    const res = await forgeAPI.auth.logout.mutateRaw(undefined, {
      raw: true,
      headers: { Cookie: 'refresh_token=somegarbage123456' }
    })

    expect(res.status).toBe(401)
  })

  it('logged-out cookie cannot be reused', async () => {
    const cookies = await loginAndCookies()

    await forgeAPI.auth.logout.mutateRaw(undefined, {
      raw: true,
      headers: { Cookie: cookies }
    })

    const after = await forgeAPI.auth.refresh.mutateRaw(undefined, {
      raw: true,
      headers: { Cookie: cookies }
    })

    expect(after.status).toBe(401)
  })

  it('all tokens in the family are invalidated after logout', async () => {
    const cookies = await loginAndCookies()

    const refreshRes = await forgeAPI.auth.refresh.mutateRaw(undefined, {
      raw: true,
      headers: { Cookie: cookies }
    })
    const rotatedCookie = extractCookies(refreshRes.headers['set-cookie'])

    await forgeAPI.auth.logout.mutateRaw(undefined, {
      raw: true,
      headers: { Cookie: cookies }
    })

    const after1 = await forgeAPI.auth.refresh.mutateRaw(undefined, {
      raw: true,
      headers: { Cookie: cookies }
    })
    const after2 = await forgeAPI.auth.refresh.mutateRaw(undefined, {
      raw: true,
      headers: { Cookie: rotatedCookie }
    })

    expect(after1.status).toBe(401)
    expect(after2.status).toBe(401)
  })

  it('double logout is safe', async () => {
    const cookies = await loginAndCookies()

    await forgeAPI.auth.logout.mutateRaw(undefined, {
      raw: true,
      headers: { Cookie: cookies }
    })

    const again = await forgeAPI.auth.logout.mutateRaw(undefined, {
      raw: true,
      headers: { Cookie: cookies }
    })

    expect(again.status).toBe(200)
  })
})
