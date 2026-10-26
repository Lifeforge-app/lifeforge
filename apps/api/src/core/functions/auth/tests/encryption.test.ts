import { describe, expect, it } from 'vitest'

import { decrypt, encrypt } from '../encryption'

const KEY = 'test-master-key'

describe('passphrase encryption (encrypt / decrypt)', () => {
  it.each(['hello', '', '{"a":1,"b":"ünïcode"}', 'a'.repeat(1000)])(
    'round trips %j',
    message => {
      expect(decrypt(encrypt(message, KEY), KEY)).toBe(message)
    }
  )

  it('produces a prefixed payload with a random IV', () => {
    const first = encrypt('hello', KEY)
    const second = encrypt('hello', KEY)

    expect(first.startsWith('v2:')).toBe(true)
    expect(first).not.toBe(second)
  })

  it('fails with the wrong passphrase', () => {
    expect(() => decrypt(encrypt('hello', KEY), 'wrong')).toThrow()
  })

  it('fails when the payload is tampered with', () => {
    const payload = Buffer.from(encrypt('hello', KEY).slice(3), 'base64')

    payload[payload.length - 1]! ^= 0xff

    expect(() => decrypt('v2:' + payload.toString('base64'), KEY)).toThrow()
  })

  it('rejects values in the legacy CryptoJS format', () => {
    const legacy = 'U2FsdGVkX1/zBR8A4//p4i8Kac3TAzNYMqhMhZV+WeQ='

    expect(() => decrypt(legacy, KEY)).toThrow('Run the crypto migration')
  })

  it('rejects values in the legacy AES-CTR format', () => {
    const legacy = Buffer.from('a'.repeat(48)).toString('base64')

    expect(() => decrypt(legacy, KEY)).toThrow('Run the crypto migration')
  })
})
