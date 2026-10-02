import mime from 'mime-types'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'

import type { Logger } from '@lifeforge/log'

import type { FileReference, ThumbnailInfo } from './contract/fileReference'
import type {
  FileStream,
  StorageGetOptions,
  StorageProvider
} from './providers/types'
import type { BufferUpload, FileMetadataStore, StagedFile } from './types'
import { generateKey, generateThumbKey, resizeImage } from './utils'

function isStagedFile(file: unknown): file is StagedFile {
  return (
    typeof file === 'object' &&
    file !== null &&
    (file as { __staged?: unknown }).__staged === true
  )
}

/**
 * File operations for a single module: key generation, ownership, provider
 * access and metadata persistence. Kept provider- and DB-agnostic via the
 * injected `StorageProvider` / `FileMetadataStore`.
 */
export class FileStorage {
  constructor(
    private provider: StorageProvider,
    private store: FileMetadataStore,
    private moduleId: string,
    private logger?: Logger
  ) {}

  async save(options: {
    file: StagedFile | BufferUpload | 'keep' | 'removed' | null | undefined
    currentKey?: string | null
    thumbs?: string[]
  }): Promise<FileReference | null> {
    const { file, currentKey, thumbs } = options

    if (file === 'removed') {
      if (currentKey) {
        await this.delete(currentKey)
      }

      return null
    }

    if (file === 'keep' || file === undefined || file === null) {
      return currentKey ? this.getReference(currentKey) : null
    }

    if (currentKey) {
      await this.delete(currentKey)
    }

    const ref = await this.putFile(file, thumbs)

    if (!ref) {
      return null
    }

    await this.store.upsert({ ...ref, moduleId: this.moduleId })

    if (isStagedFile(file)) {
      await fs.unlink(file.path).catch(() => {})
    }

    return ref
  }

  async get(
    key: string,
    options?: StorageGetOptions
  ): Promise<FileStream | null> {
    if (!this.checkKeyOwnership(key)) {
      return null
    }

    const targetKey = options?.thumb
      ? generateThumbKey(key, options.thumb)
      : key

    return this.provider.get(targetKey)
  }

  async delete(key: string): Promise<void> {
    if (!this.checkKeyOwnership(key)) {
      return
    }

    await this.provider.delete(key)
    await this.store.delete(key)
  }

  /**
   * Returns a file's metadata (original name, mime, size, thumbs), scoped to
   * this module.
   */
  async getReference(key: string): Promise<FileReference | null> {
    if (!this.checkKeyOwnership(key)) {
      return null
    }

    const meta = await this.store.get(key)

    if (!meta) {
      return null
    }

    const { moduleId: _moduleId, ...ref } = meta

    return ref
  }

  private async putFile(
    file: StagedFile | BufferUpload,
    thumbs?: string[]
  ): Promise<FileReference | null> {
    const staging = isStagedFile(file)
    const { originalName, mimeType } = file
    const size = staging ? file.size : file.buffer.length
    const ext =
      path.extname(originalName).slice(1) || mime.extension(mimeType) || 'bin'
    const key = generateKey(this.moduleId, ext)

    await this.provider.save(
      key,
      staging ? file.stream() : Readable.from(file.buffer),
      { mimeType }
    )

    const wantThumbs = !!(
      thumbs?.length &&
      mimeType.startsWith('image/') &&
      !mimeType.includes('svg')
    )

    const thumbnailInfos = wantThumbs
      ? await this.generateThumbnails(
          key,
          staging ? file.path : file.buffer,
          mimeType,
          thumbs
        )
      : []

    return { key, originalName, mimeType, size, thumbs: thumbnailInfos }
  }

  private async generateThumbnails(
    key: string,
    source: Buffer | string,
    mimeType: string,
    thumbSizes: string[]
  ): Promise<ThumbnailInfo[]> {
    const infos: ThumbnailInfo[] = []

    for (const sizeStr of thumbSizes) {
      try {
        const resized = await resizeImage(source, sizeStr)
        const thumbKey = generateThumbKey(key, sizeStr)

        await this.provider.save(thumbKey, Readable.from(resized.buffer), {
          mimeType
        })

        infos.push({
          size: sizeStr,
          key: thumbKey,
          width: resized.width,
          height: resized.height
        })
      } catch (err) {
        this.logger?.warn(
          `Failed to generate thumbnail ${sizeStr} for ${key}: ${String(err)}`
        )
      }
    }

    return infos
  }

  private checkKeyOwnership(key: string): boolean {
    if (!key.startsWith(`${this.moduleId}/`)) {
      this.logger?.warn(
        `Key ownership mismatch: "${key}" does not belong to module "${this.moduleId}"`
      )

      return false
    }

    return true
  }
}
