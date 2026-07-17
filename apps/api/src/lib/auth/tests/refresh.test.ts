import { cleanupTestTokens, initAuthTests } from '@tests/e2e-setup'
import { expectNo2FA, extractCookies, forgeAPI, unwrap } from '@tests/utils'
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

describe('POST /auth/refresh', () => {
  it('returns 200 with new accessToken and cookie', async () => {
    const cookies = await loginAndCookies()

    const res = await forgeAPI.auth.refresh.mutateRaw(undefined, {
      raw: true,
      headers: { Cookie: cookies }
    })
    const data = unwrap(res)

    expect(res.status).toBe(200)
    expect(data.accessToken).toBeTruthy()
    expect(typeof data.accessToken).toBe('string')
    expect(extractCookies(res.headers['set-cookie'])).toBeTruthy()
  })

  it('returns 401 when no cookie is sent', async () => {
    const res = await forgeAPI.auth.refresh.mutateRaw(undefined, { raw: true })

    expect(res.status).toBe(401)
  })

  it('returns 401 for an invalid cookie', async () => {
    const res = await forgeAPI.auth.refresh.mutateRaw(undefined, {
      raw: true,
      headers: { Cookie: 'refresh_token=somegarbage123456' }
    })

    expect(res.status).toBe(401)
  })

  it('old token is invalidated after rotation', async () => {
    const cookies = await loginAndCookies()

    const refresh1 = await forgeAPI.auth.refresh.mutateRaw(undefined, {
      raw: true,
      headers: { Cookie: cookies }
    })

    expect(refresh1.status).toBe(200)

    const retry = await forgeAPI.auth.refresh.mutateRaw(undefined, {
      raw: true,
      headers: { Cookie: cookies }
    })

    expect(retry.status).toBe(401)
  })

  it('new cookie from refresh is valid for subsequent requests', async () => {
    const cookies = await loginAndCookies()

    const refresh = await forgeAPI.auth.refresh.mutateRaw(undefined, {
      raw: true,
      headers: { Cookie: cookies }
    })

    expect(refresh.status).toBe(200)
  })

  it('three sequential refreshes all succeed', async () => {
    let cookies = await loginAndCookies()

    for (let i = 0; i < 3; i++) {
      const refresh = await forgeAPI.auth.refresh.mutateRaw(undefined, {
        raw: true,
        headers: { Cookie: cookies }
      })

      expect(refresh.status).toBe(200)
      expect(unwrap(refresh).accessToken).toBeTruthy()

      cookies = extractCookies(refresh.headers['set-cookie'])
      expect(cookies).toBeTruthy()
    }
  })

  it('replay detection: rotated token triggers family revocation', async () => {
    const cookies = await loginAndCookies()

    const refresh1 = await forgeAPI.auth.refresh.mutateRaw(undefined, {
      raw: true,
      headers: { Cookie: cookies }
    })

    expect(refresh1.status).toBe(200)

    const oldReplay = await forgeAPI.auth.refresh.mutateRaw(undefined, {
      raw: true,
      headers: { Cookie: cookies }
    })

    expect(oldReplay.status).toBe(401)

    const activeFail = await forgeAPI.auth.refresh.mutateRaw(undefined, {
      raw: true,
      headers: { Cookie: extractCookies(refresh1.headers['set-cookie']) }
    })

    expect(activeFail.status).toBe(401)
  })

  it('access token changes on each refresh', async () => {
    const cookies = await loginAndCookies()

    const loginToken = await forgeAPI.auth.login.mutateRaw(creds(), {
      raw: true
    })
    const refresh = await forgeAPI.auth.refresh.mutateRaw(undefined, {
      raw: true,
      headers: { Cookie: cookies }
    })

    expect(unwrap(refresh).accessToken).not.toBe(
      expectNo2FA(unwrap(loginToken)).accessToken
    )
  })
})
