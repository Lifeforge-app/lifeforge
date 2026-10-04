import { Readable } from 'node:stream'

import { beforeEach, describe, expect, it, vi } from 'vitest'

const { sendMock, uploadCtorMock, uploadDoneMock } = vi.hoisted(() => ({
  sendMock: vi.fn(),
  uploadCtorMock: vi.fn(),
  uploadDoneMock: vi.fn()
}))

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: class {
    send = sendMock
  },
  GetObjectCommand: class {
    constructor(public input: unknown) {}
  },
  DeleteObjectCommand: class {
    constructor(public input: unknown) {}
  },
  ListObjectsV2Command: class {
    constructor(public input: unknown) {}
  },
  DeleteObjectsCommand: class {
    constructor(public input: unknown) {}
  }
}))

vi.mock('@aws-sdk/lib-storage', () => ({
  Upload: class {
    done = uploadDoneMock

    constructor(public config: unknown) {
      uploadCtorMock(config)
    }
  }
}))

import { S3StorageProvider } from './s3'

describe('S3StorageProvider', () => {
  let provider: S3StorageProvider

  beforeEach(() => {
    vi.clearAllMocks()
    provider = new S3StorageProvider({ bucket: 'my-bucket' })
  })

  it('uploads through lib-storage with the content type', async () => {
    const data = Readable.from(Buffer.from('hi'))

    await provider.save('mod/a.txt', data, { mimeType: 'text/plain' })

    const config = uploadCtorMock.mock.calls[0][0] as {
      params: Record<string, unknown>
    }

    expect(config.params.Bucket).toBe('my-bucket')
    expect(config.params.Key).toBe('mod/a.txt')
    expect(config.params.Body).toBe(data)
    expect(config.params.ContentType).toBe('text/plain')
    expect(uploadDoneMock).toHaveBeenCalledOnce()
  })

  it('infers the content type from the key when not provided', async () => {
    await provider.save('mod/a.png', Readable.from(Buffer.from('x')))

    const config = uploadCtorMock.mock.calls[0][0] as {
      params: Record<string, unknown>
    }

    expect(config.params.ContentType).toBe('image/png')
  })

  it('maps a get response to a file stream', async () => {
    sendMock.mockResolvedValueOnce({
      Body: Readable.from(Buffer.from('abc')),
      ContentType: 'text/plain',
      ContentLength: 3
    })

    const file = await provider.get('mod/a.txt')

    expect(file).not.toBeNull()
    expect(file!.mimeType).toBe('text/plain')
    expect(file!.size).toBe(3)
  })

  it('returns null when the object has no body', async () => {
    sendMock.mockResolvedValueOnce({ Body: undefined })

    expect(await provider.get('mod/a.txt')).toBeNull()
  })

  it('returns null when get throws', async () => {
    sendMock.mockRejectedValueOnce(new Error('boom'))

    expect(await provider.get('mod/a.txt')).toBeNull()
  })

  it('falls back to the key mime and a zero size when headers are absent', async () => {
    sendMock.mockResolvedValueOnce({
      Body: Readable.from(Buffer.from('abc'))
    })

    const file = await provider.get('mod/a.png')

    expect(file?.mimeType).toBe('image/png')
    expect(file?.size).toBe(0)
  })

  it('deletes the object and its thumbnail siblings', async () => {
    sendMock
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        Contents: [{ Key: 'mod/a-thumb-256x0.png' }],
        NextContinuationToken: undefined
      })
      .mockResolvedValueOnce({})

    await provider.delete('mod/a.png')

    const inputs = sendMock.mock.calls.map(call => call[0].input)

    expect(inputs[0]).toMatchObject({ Key: 'mod/a.png' })
    expect(inputs[1]).toMatchObject({ Prefix: 'mod/a-thumb-' })
    expect(inputs[2]).toMatchObject({
      Delete: { Objects: [{ Key: 'mod/a-thumb-256x0.png' }] }
    })
  })

  it('ignores delete errors', async () => {
    sendMock.mockRejectedValueOnce(new Error('boom'))

    await expect(provider.delete('mod/a.png')).resolves.not.toThrow()
  })
})
