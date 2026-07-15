import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { cleanupTestTokens, initAuthTests } from '@tests/e2e-setup'
import { extractCookies, forgeAPI, unwrap } from '@tests/utils'
import { setAccessToken } from '@lifeforge/api'

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

describe('Full lifecycle', () => {
  it('login → me → refresh → me → logout → refresh fails', async () => {
    const login = await forgeAPI.auth.login.mutateRaw(creds(), { raw: true })

    expect(login.status).toBe(200)

    const accessToken1 = unwrap(login).accessToken
    const cookies1 = extractCookies(login.headers['set-cookie'])

    setAccessToken(accessToken1)
    const me1 = await forgeAPI.auth.me.queryRaw({ raw: true })

    expect(me1.status).toBe(200)
    expect(unwrap(me1).userData.email).toBe(email)

    const refresh1 = await forgeAPI.auth.refresh.mutateRaw(
      undefined,
      { raw: true, headers: { Cookie: cookies1 } }
    )

    expect(refresh1.status).toBe(200)

    const accessToken2 = unwrap(refresh1).accessToken
    const cookies2 = extractCookies(refresh1.headers['set-cookie'])

    setAccessToken(accessToken2)
    const me2 = await forgeAPI.auth.me.queryRaw({ raw: true })

    expect(me2.status).toBe(200)

    const logout = await forgeAPI.auth.logout.mutateRaw(
      undefined,
      { raw: true, headers: { Cookie: cookies2 } }
    )

    expect(logout.status).toBe(200)

    const refreshAfter = await forgeAPI.auth.refresh.mutateRaw(
      undefined,
      { raw: true, headers: { Cookie: cookies2 } }
    )

    expect(refreshAfter.status).toBe(401)

    expect(accessToken1).not.toBe(accessToken2)
  })

  it('concurrent rapid requests do not crash the server', async () => {
    const login = await forgeAPI.auth.login.mutateRaw(creds(), { raw: true })
    const cookies = extractCookies(login.headers['set-cookie'])

    const results = await Promise.allSettled(
      Array.from({ length: 5 }, () =>
        forgeAPI.auth.refresh.mutateRaw(
          undefined,
          { raw: true, headers: { Cookie: cookies } }
        )
      )
    )

    const fulfilled = results.filter(
      r => r.status === 'fulfilled'
    ) as PromiseFulfilledResult<{ status: number }>[]

    const okCount = fulfilled.filter(r => r.value.status === 200).length

    expect(okCount).toBeGreaterThanOrEqual(1)

    const noCrash = fulfilled.every(
      r => r.value.status >= 200 && r.value.status < 600
    )

    expect(noCrash).toBe(true)
  })
})
