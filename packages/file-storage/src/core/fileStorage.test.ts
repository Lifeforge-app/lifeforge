import { promises as fs } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'

import sharp from 'sharp'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { FileStorage } from './fileStorage'
import { LocalStorageProvider } from './providers/local'
import type { FileReference } from './contract/fileReference'
import type { FileMetadataStore } from './types'

class MemoryStore implements FileMetadataStore {
  private map = new Map<string, FileReference & { moduleId: string }>()

  async upsert(ref: FileReference & { moduleId: string }) {
    this.map.set(ref.key, ref)
  }

  async get(key: string) {
    return this.map.get(key) ?? null
  }

  async delete(key: string) {
    this.map.delete(key)
  }
}

const TEST_DIR = path.resolve(process.cwd(), './temp_test_storage')

describe('LocalStorageProvider & FileStorage', () => {
  let provider: LocalStorageProvider
  let storage: FileStorage

  beforeAll(async () => {
    await fs.mkdir(TEST_DIR, { recursive: true })
    provider = new LocalStorageProvider(TEST_DIR)

    storage = new FileStorage(
      provider,
      new MemoryStore(),
      'lifeforge--test-module'
    )
  })

  afterAll(async () => {
    await fs.rm(TEST_DIR, { recursive: true, force: true })
  })

  it('should save and retrieve files', async () => {
    const data = Buffer.from('hello world file storage')
    const ref = await storage.save({
      file: {
        buffer: data,
        originalName: 'file.bin',
        mimeType: 'application/octet-stream'
      }
    })

    expect(ref).not.toBeNull()
    expect(ref!.key).toContain('lifeforge--test-module/')
    expect(ref!.originalName).toBe('file.bin')

    const meta = await storage.getReference(ref!.key)
    expect(meta).not.toBeNull()

    const streamObj = await storage.get(ref!.key)
    expect(streamObj).not.toBeNull()

    const chunks: Buffer[] = []

    for await (const chunk of streamObj!.stream) {
      chunks.push(Buffer.from(chunk))
    }

    expect(Buffer.concat(chunks).toString('utf-8')).toBe(
      'hello world file storage'
    )
  })

  it('should return file metadata via getReference', async () => {
    const ref = await storage.save({
      file: {
        buffer: Buffer.from('meta'),
        originalName: 'meta.bin',
        mimeType: 'application/octet-stream'
      }
    })

    const meta = await storage.getReference(ref!.key)
    expect(meta?.originalName).toBe('meta.bin')
    expect(meta?.size).toBe(4)
  })

  it('should prevent access to other modules files (ownership check)', async () => {
    const foreignKey = 'lifeforge--other-module/123.txt'
    expect(await storage.get(foreignKey)).toBeNull()
    expect(await storage.getReference(foreignKey)).toBeNull()
  })

  it('should prevent path traversal attacks in provider', async () => {
    expect(await provider.get('../../../etc/passwd')).toBeNull()
    expect(await provider.get('....//....//etc/passwd')).toBeNull()
    await expect(
      provider.save('../../../escape.txt', Readable.from(Buffer.from('malicious')))
    ).rejects.toThrow('path traversal detected')
  })

  it('should handle save state machine (create, keep, replace, remove)', async () => {
    const ref1 = await storage.save({
      file: {
        buffer: Buffer.from('initial file'),
        originalName: 'initial.bin',
        mimeType: 'application/octet-stream'
      }
    })
    expect(ref1).not.toBeNull()

    const kept = await storage.save({
      currentKey: ref1!.key,
      file: 'keep'
    })
    expect(kept?.key).toBe(ref1!.key)

    const ref2 = await storage.save({
      currentKey: ref1!.key,
      file: {
        buffer: Buffer.from('second file'),
        originalName: 'second.bin',
        mimeType: 'application/octet-stream'
      }
    })
    expect(ref2).not.toBeNull()
    expect(ref2!.key).not.toBe(ref1!.key)
    expect(await storage.get(ref1!.key)).toBeNull()
    expect(await storage.get(ref2!.key)).not.toBeNull()
    expect(await storage.getReference(ref1!.key)).toBeNull()

    const removed = await storage.save({
      currentKey: ref2!.key,
      file: 'removed'
    })
    expect(removed).toBeNull()
    expect(await storage.get(ref2!.key)).toBeNull()
  })

  it('should generate thumbnails for image files', async () => {
    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    )

    const ref = await storage.save({
      file: {
        buffer: pngBuffer,
        mimeType: 'image/png',
        originalName: 'dot.png'
      },
      thumbs: ['200x0']
    })

    expect(ref).not.toBeNull()
    expect(ref!.thumbs).toHaveLength(1)

    const thumbStream = await storage.get(ref!.key, { thumb: '200x0' })
    expect(thumbStream).not.toBeNull()

    const chunks: Buffer[] = []

    for await (const chunk of thumbStream!.stream) {
      chunks.push(Buffer.from(chunk))
    }

    const thumbMeta = await sharp(Buffer.concat(chunks)).metadata()
    expect(thumbMeta.width).toBe(200)
  })
})
