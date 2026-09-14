import { createReadStream, createWriteStream, promises as fs } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

import pathIsInside from 'path-is-inside'

import { findProjectRoot } from '@lifeforge/configs/node'

import type { FileStream, ProviderSaveOptions, StorageProvider } from '../types'
import { extensionToMime } from '../utils'

export class LocalStorageProvider implements StorageProvider {
  private basePath: string

  constructor(basePath: string = './storage') {
    this.basePath = path.isAbsolute(basePath)
      ? path.resolve(basePath)
      : path.resolve(findProjectRoot(), basePath)
  }

  private getFilePath(key: string): string | null {
    const resolvedPath = path.resolve(this.basePath, key)

    if (
      !pathIsInside(resolvedPath, this.basePath) &&
      resolvedPath !== this.basePath
    ) {
      return null
    }

    return resolvedPath
  }

  async save(
    key: string,
    data: Buffer | Readable,
    _options?: ProviderSaveOptions
  ): Promise<void> {
    const filePath = this.getFilePath(key)

    if (!filePath) {
      throw new Error(`Invalid storage key: path traversal detected`)
    }

    await fs.mkdir(path.dirname(filePath), { recursive: true })

    if (Buffer.isBuffer(data)) {
      await fs.writeFile(filePath, data)
    } else {
      const writeStream = createWriteStream(filePath)
      await pipeline(data, writeStream)
    }
  }

  async get(key: string): Promise<FileStream | null> {
    const filePath = this.getFilePath(key)

    if (!filePath) {
      return null
    }

    try {
      const stat = await fs.stat(filePath)

      if (!stat.isFile()) {
        return null
      }

      return {
        stream: createReadStream(filePath),
        mimeType: extensionToMime(filePath),
        size: stat.size
      }
    } catch {
      return null
    }
  }

  async delete(key: string): Promise<void> {
    const filePath = this.getFilePath(key)

    if (!filePath) {
      return
    }

    try {
      await fs.unlink(filePath)
    } catch {
      // Ignore if file does not exist
    }
  }

  async deletePrefix(prefix: string): Promise<void> {
    const targetPath = this.getFilePath(prefix)

    if (!targetPath) {
      return
    }

    const dir = path.dirname(targetPath)
    const prefixBase = path.basename(targetPath)

    try {
      // If it's a directory, remove it
      await fs.rm(targetPath, { recursive: true, force: true })
    } catch {
      // Ignore
    }

    try {
      // Also clean up any sibling files matching the prefix
      const files = await fs.readdir(dir)

      for (const file of files) {
        if (file.startsWith(prefixBase)) {
          await fs.unlink(path.join(dir, file)).catch(() => {})
        }
      }
    } catch {
      // Ignore errors
    }
  }

  async exists(key: string): Promise<boolean> {
    const filePath = this.getFilePath(key)

    if (!filePath) {
      return false
    }

    try {
      const stat = await fs.stat(filePath)

      return stat.isFile()
    } catch {
      return false
    }
  }

  getURL(key: string, options?: { thumb?: string }): string | null {
    const params = new URLSearchParams()
    params.set('key', key)

    if (options?.thumb) {
      params.set('thumb', options.thumb)
    }

    return `/files?${params.toString()}`
  }
}
