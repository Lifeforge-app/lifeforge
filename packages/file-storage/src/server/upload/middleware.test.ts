import { promises as fs } from 'node:fs'
import { createServer } from 'node:http'

import express from 'express'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

const { TEST_ROOT } = vi.hoisted(() => ({
  TEST_ROOT: `${process.cwd()}/temp_test_upload_middleware`
}))

vi.mock('@lifeforge/configs/node', () => ({
  findProjectRoot: () => TEST_ROOT
}))

import type { StagedFile } from '../../core/types'
import fieldsUploadMiddleware from './middleware'

const PNG_BUFFER = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
)

describe('fieldsUploadMiddleware', () => {
  let server: ReturnType<typeof createServer>
  let baseUrl = ''
  let received: StagedFile | undefined

  beforeAll(async () => {
    await fs.rm(TEST_ROOT, { recursive: true, force: true })

    const app = express()

    app.post('/upload', fieldsUploadMiddleware({ file: 1 }), (req, res) => {
      received = (req.files as unknown as Record<string, StagedFile[]>).file?.[0]

      res.json({ ok: true })
    })

    server = createServer(app)

    await new Promise<void>(resolve => server.listen(0, resolve))

    const address = server.address()

    baseUrl =
      typeof address === 'object' && address
        ? `http://127.0.0.1:${address.port}`
        : ''
  })

  afterAll(async () => {
    await new Promise<void>(resolve => server.close(() => resolve()))
    await fs.rm(TEST_ROOT, { recursive: true, force: true })
  })

  it('stages the uploaded part into a StagedFile', async () => {
    const form = new FormData()

    form.append('file', new File([PNG_BUFFER], 'pic.png', { type: 'image/png' }))

    const res = await fetch(`${baseUrl}/upload`, { method: 'POST', body: form })

    expect(res.status).toBe(200)
    expect(received?.__staged).toBe(true)
    expect(received?.originalName).toBe('pic.png')
    expect(received?.mimeType).toBe('image/png')
    expect(received?.size).toBe(PNG_BUFFER.length)
    expect((await fs.stat(received!.path)).isFile()).toBe(true)
  })
})
