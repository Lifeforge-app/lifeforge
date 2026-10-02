import { promises as fs } from 'node:fs'
import { Readable } from 'node:stream'

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

const { TEST_ROOT } = vi.hoisted(() => ({
  TEST_ROOT: `${process.cwd()}/temp_test_staging`
}))

vi.mock('@lifeforge/configs/node', () => ({
  findProjectRoot: () => TEST_ROOT
}))

import type { FileReference } from '../../core/contract/fileReference'
import { FileStorage } from '../../core/fileStorage'
import { LocalStorageProvider } from '../../core/providers/local'
import type { FileMetadataStore } from '../../core/types'
import {
  STAGING_DIR,
  ensureStagingDir,
  releaseStaged,
  stageStream,
  sweepStagingDir
} from './staging'

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

const PNG_BUFFER = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
)

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = []

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }

  return Buffer.concat(chunks)
}

describe('staging', () => {
  beforeAll(async () => {
    await fs.rm(TEST_ROOT, { recursive: true, force: true })
  })

  afterAll(async () => {
    await fs.rm(TEST_ROOT, { recursive: true, force: true })
  })

  it('creates the staging directory', async () => {
    await ensureStagingDir()

    expect((await fs.stat(STAGING_DIR)).isDirectory()).toBe(true)
  })

  it('stages a stream with sniffed mime and byte count', async () => {
    const staged = await stageStream(
      Readable.from(PNG_BUFFER),
      'pic.png',
      'application/octet-stream'
    )

    expect(staged.__staged).toBe(true)
    expect(staged.originalName).toBe('pic.png')
    expect(staged.mimeType).toBe('image/png')
    expect(staged.size).toBe(PNG_BUFFER.length)
    expect(staged.path.startsWith(STAGING_DIR)).toBe(true)
    expect((await fs.stat(staged.path)).isFile()).toBe(true)
    expect(await staged.read()).toEqual(PNG_BUFFER)
    expect(await streamToBuffer(staged.stream())).toEqual(PNG_BUFFER)
  })

  it('falls back to the provided mime type when sniffing fails', async () => {
    const staged = await stageStream(
      Readable.from(Buffer.from('not-a-known-type')),
      'note.txt',
      'text/plain'
    )

    expect(staged.mimeType).toBe('text/plain')
    expect(staged.size).toBe('not-a-known-type'.length)
  })

  it('releases a staged file', async () => {
    const staged = await stageStream(
      Readable.from(Buffer.from('x')),
      'x.bin',
      'application/octet-stream'
    )

    await releaseStaged(staged)

    await expect(fs.stat(staged.path)).rejects.toThrow()

    await expect(releaseStaged(staged)).resolves.not.toThrow()
  })

  it('sweeps only files older than the TTL', async () => {
    const oldFile = await stageStream(
      Readable.from(Buffer.from('old')),
      'old.bin',
      'application/octet-stream'
    )
    const freshFile = await stageStream(
      Readable.from(Buffer.from('fresh')),
      'fresh.bin',
      'application/octet-stream'
    )

    await fs.utimes(oldFile.path, new Date(0), new Date(0))

    await sweepStagingDir()

    await expect(fs.stat(oldFile.path)).rejects.toThrow()
    expect((await fs.stat(freshFile.path)).isFile()).toBe(true)
  })

  it('commits a staged file through FileStorage.save', async () => {
    const storage = new FileStorage(
      new LocalStorageProvider(`${TEST_ROOT}/provider`),
      new MemoryStore(),
      'mod'
    )

    const staged = await stageStream(
      Readable.from(PNG_BUFFER),
      'p.png',
      'image/png'
    )

    const ref = await storage.save({ file: staged })

    expect(ref).not.toBeNull()
    expect(ref!.originalName).toBe('p.png')

    const stream = await storage.get(ref!.key)

    expect(await streamToBuffer(stream!.stream)).toEqual(PNG_BUFFER)

    await expect(fs.stat(staged.path)).rejects.toThrow()
  })
})
