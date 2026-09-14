import { promises as fs } from 'node:fs'
import path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { FileStorage } from './fileStorage'
import { LocalStorageProvider } from './providers/local'
import { generateKey, generateThumbKey, parseThumbSize, resizeImage } from './utils'

const TEST_DIR = path.resolve(process.cwd(), './temp_test_storage')

describe('File Storage Utilities', () => {
  it('should parse thumbnail sizes correctly', () => {
    expect(parseThumbSize('200x0')).toEqual({ width: 200 })
    expect(parseThumbSize('0x512')).toEqual({ height: 512 })
    expect(parseThumbSize('200x200')).toEqual({ width: 200, height: 200 })
    expect(parseThumbSize('invalid')).toEqual({})
  })

  it('should generate valid thumbnail keys', () => {
    expect(
      generateThumbKey('lifeforge--books-library/booksEntries/fileKey-123.epub', '200x0')
    ).toBe('lifeforge--books-library/booksEntries/fileKey-123-thumb-200x0.epub')
  })

  it('should generate valid hierarchical storage keys', () => {
    const key = generateKey('lifeforge--books-library', 'booksEntries', 'fileKey', 'epub')
    expect(key).toMatch(/^lifeforge--books-library\/booksEntries\/fileKey-[0-9a-f-]+\.epub$/)
  })
})

describe('LocalStorageProvider & FileStorage', () => {
  let provider: LocalStorageProvider
  let storage: FileStorage<any>

  beforeAll(async () => {
    await fs.mkdir(TEST_DIR, { recursive: true })
    provider = new LocalStorageProvider(TEST_DIR)
    storage = new FileStorage(
      provider,
      { source: 'app', id: 'lifeforge--test-module' },
      {
        testEntries: {
          fileKey: 'string',
          thumbnailKey: 'string'
        }
      }
    )
  })

  afterAll(async () => {
    await fs.rm(TEST_DIR, { recursive: true, force: true })
  })

  it('should save and retrieve files', async () => {
    const data = Buffer.from('hello world file storage')
    const key = await storage.save({
      file: data,
      table: 'testEntries',
      field: 'fileKey'
    })

    expect(key).not.toBeNull()
    expect(key).toContain('lifeforge--test-module/testEntries/fileKey-')

    const exists = await storage.exists(key!)
    expect(exists).toBe(true)

    const streamObj = await storage.get(key!)
    expect(streamObj).not.toBeNull()

    // Read stream content
    const chunks: Buffer[] = []
    for await (const chunk of streamObj!.stream) {
      chunks.push(Buffer.from(chunk))
    }
    const content = Buffer.concat(chunks).toString('utf-8')
    expect(content).toBe('hello world file storage')
  })

  it('should prevent access to other modules files (ownership check)', async () => {
    const foreignKey = 'lifeforge--other-module/entries/fileKey-123.txt'
    expect(await storage.get(foreignKey)).toBeNull()
    expect(await storage.exists(foreignKey)).toBe(false)
    expect(storage.getURL(foreignKey)).toBeNull()
  })

  it('should prevent path traversal attacks in provider', async () => {
    expect(await provider.get('../../../etc/passwd')).toBeNull()
    expect(await provider.exists('../../../etc/passwd')).toBe(false)
    expect(await provider.get('....//....//etc/passwd')).toBeNull()
    await expect(
      provider.save('../../../escape.txt', Buffer.from('malicious'))
    ).rejects.toThrow('path traversal detected')
  })

  it('should handle save state machine (create, keep, replace, remove)', async () => {
    // 1. Initial save (create)
    const file1 = Buffer.from('initial file')
    const key1 = await storage.save({
      file: file1,
      table: 'testEntries',
      field: 'fileKey'
    })
    expect(key1).not.toBeNull()

    // 2. Keep state
    const kept = await storage.save({
      currentKey: key1,
      file: 'keep',
      table: 'testEntries',
      field: 'fileKey'
    })
    expect(kept).toBe(key1)

    // 3. Replace with new file
    const file2 = Buffer.from('second file')
    const key2 = await storage.save({
      currentKey: key1,
      file: file2,
      table: 'testEntries',
      field: 'fileKey'
    })
    expect(key2).not.toBeNull()
    expect(key2).not.toBe(key1)
    expect(await storage.exists(key1!)).toBe(false) // old file deleted
    expect(await storage.exists(key2!)).toBe(true) // new file exists

    // 4. Removed state
    const removed = await storage.save({
      currentKey: key2,
      file: 'removed',
      table: 'testEntries',
      field: 'fileKey'
    })
    expect(removed).toBeNull()
    expect(await storage.exists(key2!)).toBe(false)
  })

  it('should generate thumbnails for image files', async () => {
    // 1x1 transparent PNG buffer
    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    )

    const directResized = await resizeImage(pngBuffer, '200x0')
    expect(directResized.buffer).toBeDefined()
    expect(directResized.width).toBe(200)

    const key = await storage.save({
      file: {
        buffer: pngBuffer,
        mimetype: 'image/png',
        originalname: 'dot.png'
      },
      table: 'testEntries',
      field: 'thumbnailKey',
      thumbs: ['200x0']
    })

    expect(key).not.toBeNull()

    const thumbStream = await storage.get(key!, { thumb: '200x0' })
    expect(thumbStream).not.toBeNull()
  })
})
