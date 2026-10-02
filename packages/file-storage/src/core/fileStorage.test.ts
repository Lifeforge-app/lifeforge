import { createReadStream, promises as fs } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'

import sharp from 'sharp'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import {
  fileReferenceSchema,
  type FileReference
} from './contract/fileReference'
import { FileStorage } from './fileStorage'
import { LocalStorageProvider } from './providers/local'
import type { FileMetadataStore, StagedFile } from './types'

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

const PNG_BUFFER = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
)

async function makeStagedFile(
  data: Buffer,
  originalName: string,
  mimeType: string
): Promise<StagedFile> {
  const filePath = path.join(
    TEST_DIR,
    `${crypto.randomUUID()}-${originalName}`
  )

  await fs.writeFile(filePath, data)

  return {
    __staged: true,
    originalName,
    mimeType,
    size: data.length,
    path: filePath,
    read: () => fs.readFile(filePath),
    stream: () => createReadStream(filePath)
  }
}

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

    const liveStream = await storage.get(ref2!.key)

    expect(liveStream).not.toBeNull()

    const liveChunks: Buffer[] = []

    for await (const chunk of liveStream!.stream) {
      liveChunks.push(Buffer.from(chunk))
    }

    expect(Buffer.concat(liveChunks).toString()).toBe('second file')
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

  it('saves a staged file and removes the staged temp after commit', async () => {
    const staged = await makeStagedFile(
      Buffer.from('staged content'),
      'staged.txt',
      'text/plain'
    )

    const ref = await storage.save({ file: staged })

    expect(ref).not.toBeNull()
    expect(ref!.originalName).toBe('staged.txt')

    const got = await storage.get(ref!.key)
    const chunks: Buffer[] = []

    for await (const chunk of got!.stream) {
      chunks.push(Buffer.from(chunk))
    }

    expect(Buffer.concat(chunks).toString()).toBe('staged content')
    await expect(fs.stat(staged.path)).rejects.toThrow()
  })

  it('generates thumbnails from a staged image', async () => {
    const staged = await makeStagedFile(PNG_BUFFER, 'big.png', 'image/png')

    const ref = await storage.save({ file: staged, thumbs: ['100x0'] })

    expect(ref!.thumbs).toHaveLength(1)

    const thumb = await storage.get(ref!.key, { thumb: '100x0' })
    const chunks: Buffer[] = []

    for await (const chunk of thumb!.stream) {
      chunks.push(Buffer.from(chunk))
    }

    expect((await sharp(Buffer.concat(chunks)).metadata()).width).toBe(100)
  })

  it('does not generate thumbnails for non-images', async () => {
    const ref = await storage.save({
      file: {
        buffer: Buffer.from('<svg></svg>'),
        originalName: 'icon.svg',
        mimeType: 'image/svg+xml'
      },
      thumbs: ['100x0']
    })

    expect(ref!.thumbs).toEqual([])
  })

  it('returns the existing reference when no new file is supplied', async () => {
    const ref = await storage.save({
      file: {
        buffer: Buffer.from('keep me'),
        originalName: 'keep.txt',
        mimeType: 'text/plain'
      }
    })

    expect(
      (await storage.save({ file: 'keep', currentKey: ref!.key }))?.key
    ).toBe(ref!.key)
    expect(
      (await storage.save({ file: null, currentKey: ref!.key }))?.key
    ).toBe(ref!.key)
    expect(await storage.save({ file: null })).toBeNull()
  })

  it('returns null when removing without a current key', async () => {
    expect(await storage.save({ file: 'removed' })).toBeNull()
  })

  it('derives the key extension from the mime type or falls back to bin', async () => {
    const fromMime = await storage.save({
      file: {
        buffer: Buffer.from('x'),
        originalName: 'noext',
        mimeType: 'image/png'
      }
    })
    expect(fromMime!.key.endsWith('.png')).toBe(true)

    const fallback = await storage.save({
      file: {
        buffer: Buffer.from('x'),
        originalName: 'noext',
        mimeType: 'application/x-unknown-xyz'
      }
    })
    expect(fallback!.key.endsWith('.bin')).toBe(true)
  })

  it('produces references that satisfy the contract schema', async () => {
    const withThumbs = await storage.save({
      file: {
        buffer: PNG_BUFFER,
        originalName: 'contract.png',
        mimeType: 'image/png'
      },
      thumbs: ['64x0']
    })

    expect(fileReferenceSchema.safeParse(withThumbs).success).toBe(true)

    const plain = await storage.save({
      file: {
        buffer: Buffer.from('plain'),
        originalName: 'plain.txt',
        mimeType: 'text/plain'
      }
    })

    expect(fileReferenceSchema.safeParse(plain).success).toBe(true)

    expect(
      fileReferenceSchema.safeParse({
        ...withThumbs,
        thumbs: [{ size: '64x0' }]
      }).success
    ).toBe(false)
  })

  it('is a no-op when deleting a foreign key', async () => {
    await expect(storage.delete('lifeforge--other-module/1.txt')).resolves.not.toThrow()
  })
})
