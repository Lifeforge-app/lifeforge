import { promises as fs } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { LocalStorageProvider } from './local'

const TEST_DIR = path.resolve(process.cwd(), './temp_test_local_provider')

async function readStream(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = []

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }

  return Buffer.concat(chunks)
}

describe('LocalStorageProvider', () => {
  let provider: LocalStorageProvider

  beforeAll(async () => {
    await fs.rm(TEST_DIR, { recursive: true, force: true })
    provider = new LocalStorageProvider(TEST_DIR)
  })

  afterAll(async () => {
    await fs.rm(TEST_DIR, { recursive: true, force: true })
  })

  it('writes a stream and reads it back with mime + size', async () => {
    await provider.save('module/hello.txt', Readable.from(Buffer.from('hello')))

    const file = await provider.get('module/hello.txt')

    expect(file).not.toBeNull()
    expect(file!.size).toBe(5)
    expect(file!.mimeType).toBe('text/plain')
    expect((await readStream(file!.stream)).toString()).toBe('hello')
  })

  it('creates missing directories on save', async () => {
    await provider.save(
      'module/deep/nested/file.bin',
      Readable.from(Buffer.from('x'))
    )

    expect(
      await fs
        .stat(path.join(TEST_DIR, 'module/deep/nested/file.bin'))
        .then(() => true)
        .catch(() => false)
    ).toBe(true)
  })

  it('infers mime from the key extension when not provided', async () => {
    await provider.save('module/pic.png', Readable.from(Buffer.from('png')))

    const file = await provider.get('module/pic.png')

    expect(file?.mimeType).toBe('image/png')
    expect((await readStream(file!.stream)).toString()).toBe('png')
  })

  it('returns null for a missing key', async () => {
    expect(await provider.get('module/missing.txt')).toBeNull()
  })

  it('returns null for a directory key', async () => {
    await provider.save('module/dir/a.txt', Readable.from(Buffer.from('a')))

    expect(await provider.get('module/dir')).toBeNull()
  })

  it('deletes the file and its thumbnail siblings', async () => {
    await provider.save('module/avatar.png', Readable.from(Buffer.from('a')))
    await fs.writeFile(
      path.join(TEST_DIR, 'module/avatar-thumb-256x0.png'),
      'thumb'
    )

    await provider.delete('module/avatar.png')

    expect(await provider.get('module/avatar.png')).toBeNull()
    await expect(
      fs.stat(path.join(TEST_DIR, 'module/avatar-thumb-256x0.png'))
    ).rejects.toThrow()
  })

  it('rejects path traversal', async () => {
    expect(await provider.get('../../../etc/passwd')).toBeNull()
    expect(await provider.get('....//....//etc/passwd')).toBeNull()

    await expect(
      provider.save('../../escape.txt', Readable.from(Buffer.from('x')))
    ).rejects.toThrow('path traversal detected')

    await expect(provider.delete('../../escape.txt')).resolves.not.toThrow()
  })
})
