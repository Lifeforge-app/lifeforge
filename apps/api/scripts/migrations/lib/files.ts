import path from 'node:path'

import { FileStorage, createProvider } from '@lifeforge/file-storage'

import { requireEnv } from './env'

const MIME_BY_EXT: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  avif: 'image/avif',
  bmp: 'image/bmp',
  ttf: 'font/ttf',
  otf: 'font/otf',
  woff: 'font/woff',
  woff2: 'font/woff2',
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  flac: 'audio/flac',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  pdf: 'application/pdf',
  epub: 'application/epub+zip',
  json: 'application/json',
  zip: 'application/zip',
  txt: 'text/plain'
}

function mimeFor(filename: string): string {
  const ext = path.extname(filename).slice(1).toLowerCase()

  return MIME_BY_EXT[ext] ?? 'application/octet-stream'
}

/** Creates a FileStorage scoped to a module id (matches runtime storage keys). */
export function createModuleStorage(moduleId: string): FileStorage {
  const provider = createProvider()

  return new FileStorage(provider, { id: moduleId })
}

/** Fetches a single file from the running PocketBase instance. */
export async function fetchPbFile(
  collection: string,
  recordId: string,
  filename: string
): Promise<Buffer> {
  const pbHost = requireEnv('PB_HOST').replace(/\/$/, '')
  const url = `${pbHost}/api/files/${collection}/${recordId}/${encodeURIComponent(filename)}`

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)
  }

  return Buffer.from(await res.arrayBuffer())
}

/**
 * Fetches a PB file and stores it through the new file-storage SDK, returning
 * the new storage key. `field` should be the target column's DB name so the
 * generated key is stable and readable.
 */
export async function migrateFileField(options: {
  storage: FileStorage
  pbCollection: string
  recordId: string
  filename: string
  table: string
  field: string
  thumbs?: string[] | null
}): Promise<string | null> {
  const { storage, pbCollection, recordId, filename, table, field, thumbs } =
    options

  const buffer = await fetchPbFile(pbCollection, recordId, filename)

  const file = {
    buffer,
    originalname: filename,
    mimetype: mimeFor(filename)
  } as unknown as Express.Multer.File

  return storage.save({
    file,
    table,
    field,
    thumbs: thumbs && thumbs.length > 0 ? thumbs : undefined
  })
}
