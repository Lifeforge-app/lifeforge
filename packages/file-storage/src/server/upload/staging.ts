import { fileTypeStream } from 'file-type'
import { createReadStream, createWriteStream, promises as fs } from 'node:fs'
import path from 'node:path'
import { Readable, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'

import { findProjectRoot } from '@lifeforge/configs/node'

import type { StagedFile } from '../../core/types'

/** Directory holding staged uploads until they are committed (or discarded).
 * Fixed to a `.staging` subdirectory of the local storage root. */
export const STAGING_DIR = path.resolve(
  findProjectRoot(),
  process.env.FILE_STORAGE_LOCAL_PATH || './storage',
  '.staging'
)

/** How long a staged file may linger before the sweep reclaims it. */
const STAGING_TTL_MS = 6 * 60 * 60 * 1000

export async function ensureStagingDir(): Promise<void> {
  await fs.mkdir(STAGING_DIR, { recursive: true })
}

/** Streams an uploaded part into the staging area and returns its handle. */
export async function stageStream(
  stream: Readable,
  originalName: string,
  fallbackMimeType: string
): Promise<StagedFile> {
  await ensureStagingDir()

  const ext = path.extname(originalName)
  const filePath = path.join(STAGING_DIR, `${crypto.randomUUID()}${ext}`)

  const detected = await fileTypeStream(
    Readable.toWeb(stream) as unknown as globalThis.ReadableStream
  )
  const fileType = (detected as { fileType?: { ext: string; mime: string } })
    .fileType

  let size = 0

  const counter = new Transform({
    transform(chunk, _enc, done) {
      size += chunk.length
      done(null, chunk)
    }
  })

  const nodeStream = Readable.fromWeb(
    detected as unknown as Parameters<typeof Readable.fromWeb>[0]
  )

  nodeStream.pipe(counter)

  await pipeline(counter, createWriteStream(filePath))

  return {
    __staged: true,
    originalName,
    mimeType: fileType?.mime || fallbackMimeType || 'application/octet-stream',
    size,
    path: filePath,
    read: () => fs.readFile(filePath),
    stream: () => createReadStream(filePath)
  }
}

export async function releaseStaged(file: StagedFile): Promise<void> {
  if (file?.path) {
    await fs.unlink(file.path).catch(() => {})
  }
}

/** Deletes staged files older than the TTL (crash/leftover recovery). */
export async function sweepStagingDir(): Promise<void> {
  try {
    await ensureStagingDir()

    const now = Date.now()
    const entries = await fs.readdir(STAGING_DIR)

    for (const entry of entries) {
      const entryPath = path.join(STAGING_DIR, entry)

      try {
        const stat = await fs.stat(entryPath)

        if (stat.isFile() && now - stat.mtimeMs > STAGING_TTL_MS) {
          await fs.unlink(entryPath)
        }
      } catch {
        // ignore individual entry errors
      }
    }
  } catch {
    // staging dir may not exist yet
  }
}
