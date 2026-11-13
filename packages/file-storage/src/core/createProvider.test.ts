import { promises as fs } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { createProvider } from './createProvider'
import { LocalStorageProvider } from './providers/local'
import { S3StorageProvider } from './providers/s3'

const ENV_KEYS = [
  'FILE_STORAGE_PROVIDER',
  'FILE_STORAGE_S3_BUCKET',
  'FILE_STORAGE_LOCAL_PATH'
] as const

const CUSTOM_DIR = path.resolve(process.cwd(), './temp_test_custom_storage')

describe('createProvider', () => {
  let saved: Record<string, string | undefined>

  beforeEach(() => {
    saved = {}

    for (const key of ENV_KEYS) {
      saved[key] = process.env[key]
      delete process.env[key]
    }
  })

  afterEach(async () => {
    for (const key of ENV_KEYS) {
      if (saved[key] === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = saved[key]
      }
    }

    await fs.rm(CUSTOM_DIR, { recursive: true, force: true })
  })

  it('defaults to the local provider', () => {
    expect(createProvider()).toBeInstanceOf(LocalStorageProvider)
  })

  it('honors FILE_STORAGE_LOCAL_PATH', async () => {
    process.env.FILE_STORAGE_LOCAL_PATH = CUSTOM_DIR

    const provider = createProvider()

    expect(provider).toBeInstanceOf(LocalStorageProvider)

    await provider.save('mod/a.txt', Readable.from(Buffer.from('x')))

    expect((await fs.stat(path.join(CUSTOM_DIR, 'mod/a.txt'))).isFile()).toBe(
      true
    )
  })

  it('throws when s3 is selected without a bucket', () => {
    process.env.FILE_STORAGE_PROVIDER = 's3'

    expect(() => createProvider()).toThrow('FILE_STORAGE_S3_BUCKET')
  })

  it('creates an S3 provider when configured', () => {
    process.env.FILE_STORAGE_PROVIDER = 's3'
    process.env.FILE_STORAGE_S3_BUCKET = 'my-bucket'

    expect(createProvider()).toBeInstanceOf(S3StorageProvider)
  })
})
