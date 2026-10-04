import path from 'node:path'

import { FileStorage, createProvider } from '@lifeforge/file-storage'
import { createFileMetadataStore } from '@lifeforge/file-storage/server'

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
  opus: 'audio/opus',
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

/**
 * Creates a `FileStorage` scoped to a module id (matches runtime storage keys)
 * and backed by the migration db, so migrated files also get metadata rows in
 * the `files` table.
 */
export function createModuleStorage(moduleId: string, db: any): FileStorage {
  const provider = createProvider()

  return new FileStorage(provider, createFileMetadataStore(db), moduleId)
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
 * Fetches a file from PocketBase and stores it through the file-storage SDK
 * (new key + thumbnails + `files` metadata row), returning the new storage key.
 */
export async function migrateFileField(options: {
  storage: FileStorage
  pbCollection: string
  recordId: string
  filename: string
  thumbs?: string[] | null
  currentKey?: string | null
}): Promise<string | null> {
  const { storage, pbCollection, recordId, filename, thumbs, currentKey } =
    options

  const buffer = await fetchPbFile(pbCollection, recordId, filename)

  const file = {
    buffer,
    originalName: filename,
    mimeType: mimeFor(filename)
  }

  const ref = await storage.save({
    file,
    currentKey: currentKey ?? undefined,
    thumbs: thumbs && thumbs.length > 0 ? thumbs : undefined
  })

  return ref?.key ?? null
}
