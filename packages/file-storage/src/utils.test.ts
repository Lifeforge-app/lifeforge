import sharp from 'sharp'
import { describe, expect, it } from 'vitest'

import { generateKey, generateThumbKey, resizeImage } from './utils'

describe('generateKey', () => {
  it('should generate valid hierarchical storage key with clean extension', () => {
    const key = generateKey(
      'lifeforge--books-library',
      'booksEntries',
      'fileKey',
      'epub'
    )
    expect(key).toMatch(
      /^lifeforge--books-library\/booksEntries\/fileKey-[0-9a-f-]{36}\.epub$/
    )
  })

  it('should strip leading dot from extension if present', () => {
    const key = generateKey('test-module', 'photos', 'avatar', '.png')
    expect(key).toMatch(/^test-module\/photos\/avatar-[0-9a-f-]{36}\.png$/)
    expect(key).not.toContain('..')
  })

  it('should generate unique keys on consecutive calls', () => {
    const key1 = generateKey('mod', 'tbl', 'fld', 'jpg')
    const key2 = generateKey('mod', 'tbl', 'fld', 'jpg')
    expect(key1).not.toBe(key2)
  })
})

describe('generateThumbKey', () => {
  it('should generate valid thumbnail key with extension', () => {
    const thumbKey = generateThumbKey(
      'lifeforge--books-library/booksEntries/fileKey-123.epub',
      '200x0'
    )
    expect(thumbKey).toBe(
      'lifeforge--books-library/booksEntries/fileKey-123-thumb-200x0.epub'
    )
  })

  it('should generate thumbnail key when key has no extension', () => {
    const thumbKey = generateThumbKey('module/table/file-123', '100x100')
    expect(thumbKey).toBe('module/table/file-123-thumb-100x100')
  })

  it('should handle keys with multiple dots', () => {
    const thumbKey = generateThumbKey(
      'module/table/archive.backup.tar.gz',
      '300x200'
    )
    expect(thumbKey).toBe('module/table/archive.backup.tar-thumb-300x200.gz')
  })
})

describe('resizeImage', () => {
  // 100x50 test PNG image
  async function createTestImage(width: number, height: number) {
    return sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 }
      }
    })
      .png()
      .toBuffer()
  }

  it.each([
    {
      size: '20x20',
      expectedW: 20,
      expectedH: 20,
      desc: 'fixed width and height (cover fit)'
    },
    {
      size: '50x0',
      expectedW: 50,
      expectedH: 25,
      desc: 'width only (inside fit)'
    },
    {
      size: '0x25',
      expectedW: 50,
      expectedH: 25,
      desc: 'height only (inside fit)'
    },
    {
      size: '0x0',
      expectedW: 100,
      expectedH: 50,
      desc: 'unconstrained/zero dimensions'
    }
  ])(
    'should resize with $desc ($size)',
    async ({ size, expectedW, expectedH }) => {
      const input = await createTestImage(100, 50)
      const result = await resizeImage(input, size)

      expect(result.buffer).toBeInstanceOf(Buffer)
      expect(result.buffer.length).toBeGreaterThan(0)
      expect(result.width).toBe(expectedW)
      expect(result.height).toBe(expectedH)

      const actualMeta = await sharp(result.buffer).metadata()
      expect(actualMeta.width).toBe(expectedW)
      expect(actualMeta.height).toBe(expectedH)
    }
  )
})
