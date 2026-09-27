import mime from 'mime-types'
import { promises as fs } from 'node:fs'
import path from 'node:path'

import type { Logger } from '@lifeforge/log'

import type {
  FileStream,
  SaveOptions,
  StorageGetOptions,
  StorageProvider,
  TableKey
} from './types'
import {
  generateKey,
  generateThumbKey,
  resizeImage
} from './utils'

export class FileStorage<
  TSchema extends Record<string, unknown> = Record<string, unknown>
> {
  private provider: StorageProvider
  private moduleId: string
  private schemas: TSchema
  private logger?: Logger

  constructor(
    provider: StorageProvider,
    module: { source?: string; id: string },
    schemas?: TSchema,
    logger?: Logger
  ) {
    this.provider = provider
    this.moduleId = module.id
    this.schemas = (schemas ?? {}) as TSchema
    this.logger = logger
  }

  async save<TTable extends TableKey<TSchema>>(
    options: SaveOptions<TSchema, TTable>
  ): Promise<string | null> {
    const { file, currentKey } = options

    if (file === 'keep') {
      return currentKey ?? null
    }

    if (file === 'removed') {
      if (currentKey) {
        await this.delete(currentKey)
      }

      return null
    }

    if (!file) {
      return currentKey ?? null
    }

    const tableName = String(options.table)
    const fieldName = String(options.field)

    if (!this.validateTarget(tableName, fieldName)) {
      return null
    }

    const upload = await this.normalizeUpload(file)

    if (!upload) {
      return null
    }

    // Delete existing file before saving replacement
    if (currentKey) {
      await this.delete(currentKey)
    }

    const ext =
      path.extname(upload.filename).slice(1) ||
      mime.extension(upload.mimeType) ||
      'bin'

    const key = generateKey(this.moduleId, tableName, fieldName, ext)

    await this.provider.save(key, upload.buffer, {
      mimeType: upload.mimeType,
      size: upload.buffer.length
    })

    await this.generateThumbnails(
      key,
      upload.buffer,
      upload.mimeType,
      options.thumbs
    )

    if (upload.tempPath) {
      await fs.unlink(upload.tempPath).catch(() => {})
    }

    return key
  }

  async get(key: string, options?: StorageGetOptions): Promise<FileStream | null> {
    if (!this.checkKeyOwnership(key)) {
      return null
    }

    let targetKey = key

    if (options?.thumb) {
      targetKey = generateThumbKey(key, options.thumb)
    }

    return this.provider.get(targetKey)
  }

  async delete(key: string): Promise<void> {
    if (!this.checkKeyOwnership(key)) {
      return
    }

    await this.provider.delete(key)
  }

  async exists(key: string): Promise<boolean> {
    if (!this.checkKeyOwnership(key)) {
      return false
    }

    return this.provider.exists(key)
  }

  private checkKeyOwnership(key: string) {
    if (!key.startsWith(`${this.moduleId}/`)) {
      this.logger?.warn(
        `Key ownership mismatch: "${key}" does not belong to module "${this.moduleId}"`
      )

      return false
    }

    return true
  }

  private validateTarget(tableName: string, fieldName: string) {
    if (Object.keys(this.schemas).length === 0) {
      return true
    }

    const table = this.schemas[tableName]

    if (!table) {
      this.logger?.warn(
        `Unknown table "${tableName}" for module "${this.moduleId}". ` +
          `Allowed: ${Object.keys(this.schemas).join(', ')}`
      )

      return false
    }

    const tableObj = table as Record<string, unknown>
    const columns =
      (tableObj._ as { columns?: Record<string, unknown> })?.columns ??
      (tableObj.$inferSelect as Record<string, unknown>) ??
      tableObj

    if (columns && !(fieldName in columns)) {
      this.logger?.warn(
        `Unknown field "${fieldName}" in table "${tableName}". ` +
          `Available fields: ${Object.keys(columns).join(', ')}`
      )

      return false
    }

    return true
  }

  private async normalizeUpload(file: Express.Multer.File | Buffer) {
    if (Buffer.isBuffer(file)) {
      return {
        buffer: file,
        filename: 'file.bin',
        mimeType: 'application/octet-stream'
      }
    }

    if (file && typeof file === 'object') {
      if ('buffer' in file && Buffer.isBuffer(file.buffer)) {
        return {
          buffer: file.buffer,
          filename: file.originalname || 'file.bin',
          mimeType: file.mimetype || 'application/octet-stream'
        }
      }

      if ('path' in file && typeof file.path === 'string' && file.path) {
        const buffer = await fs.readFile(file.path)

        return {
          buffer,
          filename: file.originalname || 'file.bin',
          mimeType: file.mimetype || 'application/octet-stream',
          tempPath: file.path
        }
      }
    }

    this.logger?.warn('Invalid file input provided to FileStorage.save')

    return null
  }

  private async generateThumbnails(
    key: string,
    buffer: Buffer,
    mimeType: string,
    thumbSizes?: string[]
  ) {
    if (
      !thumbSizes?.length ||
      !mimeType.startsWith('image/') ||
      mimeType.includes('svg')
    ) {
      return
    }

    for (const sizeStr of thumbSizes) {
      try {
        const resized = await resizeImage(buffer, sizeStr)
        const thumbKey = generateThumbKey(key, sizeStr)
        await this.provider.save(thumbKey, resized.buffer, {
          mimeType,
          size: resized.buffer.length
        })
      } catch (err) {
        this.logger?.warn(
          `Failed to generate thumbnail ${sizeStr} for ${key}: ${String(err)}`
        )
      }
    }
  }
}
