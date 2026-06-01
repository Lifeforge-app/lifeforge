import { describe, expect, it, vi } from 'vitest'

import type { ProxyTree } from '@lifeforge/shared'

import {
  convertFormFileFieldData,
  getFormFileFieldInitialData
} from './file-utils'

describe('file-utils', () => {
  describe('convertFormFileFieldData', () => {
    it('should return "removed" when value is null, undefined, or empty', () => {
      expect(convertFormFileFieldData(null)).toBe('removed')
      expect(convertFormFileFieldData(undefined)).toBe('removed')
      expect(convertFormFileFieldData({ type: 'empty' })).toBe('removed')
    })

    it('should return "keep" when value type is "existing"', () => {
      expect(
        convertFormFileFieldData({
          type: 'existing',
          id: 'some-id',
          filename: 'image.png'
        })
      ).toBe('keep')
    })

    it('should return the File object when value type is "upload"', () => {
      const dummyFile = new File([''], 'test.png', { type: 'image/png' })

      expect(
        convertFormFileFieldData({
          type: 'upload',
          file: dummyFile
        })
      ).toBe(dummyFile)
    })

    it('should return the URL string when value type is "url"', () => {
      expect(
        convertFormFileFieldData({
          type: 'url',
          url: 'https://example.com/image.png'
        })
      ).toBe('https://example.com/image.png')
    })
  })

  describe('getFormFileFieldInitialData', () => {
    const mockGetMedia = vi.fn(function () {
      return 'http://media-url/image.png'
    })

    const mockForgeAPI = {
      getMedia: mockGetMedia
    } as unknown as ProxyTree<Record<string, unknown>>

    it('should return empty when file is falsy', () => {
      expect(getFormFileFieldInitialData(mockForgeAPI, {}, null)).toEqual({
        type: 'empty'
      })
      expect(getFormFileFieldInitialData(mockForgeAPI, {}, undefined)).toEqual({
        type: 'empty'
      })
    })

    it('should return upload when file is File instance', () => {
      const dummyFile = new File([''], 'test.png', { type: 'image/png' })

      const result = getFormFileFieldInitialData(mockForgeAPI, {}, dummyFile)

      expect(result.type).toBe('upload')

      if (result.type === 'upload') {
        expect(result.file).toBe(dummyFile)
        expect(result.preview).toBeDefined()
      }
    })

    it('should return url when file starts with http/data/blob protocol', () => {
      const result = getFormFileFieldInitialData(
        mockForgeAPI,
        {},
        'http://external.com/pic.png'
      )

      expect(result).toEqual({
        type: 'url',
        url: 'http://external.com/pic.png',
        preview: 'http://external.com/pic.png'
      })
    })

    it('should return existing when file is filename and resolve preview via api', () => {
      const result = getFormFileFieldInitialData(
        mockForgeAPI,
        { collectionId: 'col', id: 'rec' },
        'existing-pic.png'
      )

      expect(mockGetMedia).toHaveBeenCalledWith({
        collectionId: 'col',
        recordId: 'rec',
        fieldId: 'existing-pic.png'
      })

      expect(result).toEqual({
        type: 'existing',
        id: 'existing-pic.png',
        filename: 'existing-pic.png',
        preview: 'http://media-url/image.png'
      })
    })
  })
})
