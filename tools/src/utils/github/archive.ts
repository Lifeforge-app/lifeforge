import fs, { createWriteStream } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import type { ReadableStream as WebReadableStream } from 'node:stream/web'
import { extract as tarExtract } from 'tar'

/**
 * Downloads a GitHub repo archive at a specific ref (commit SHA) and extracts
 * it into `destDir` (stripping the top-level `<repo>-<ref>/` directory).
 */
export async function downloadArchive(
  repo: string,
  ref: string,
  destDir: string
): Promise<void> {
  const url = `https://github.com/${repo}/archive/${ref}.tar.gz`

  const response = await fetch(url)

  if (!response.ok || !response.body) {
    throw new Error(`Failed to download ${url}: ${response.status}`)
  }

  fs.mkdirSync(destDir, { recursive: true })

  const tarball = path.join(
    os.tmpdir(),
    `forge-${Date.now()}-${Math.random().toString(36).slice(2)}.tar.gz`
  )

  await pipeline(
    Readable.fromWeb(response.body as unknown as WebReadableStream),
    createWriteStream(tarball)
  )

  try {
    await tarExtract({ file: tarball, cwd: destDir, strip: 1 })
  } finally {
    fs.rmSync(tarball, { force: true })
  }
}
