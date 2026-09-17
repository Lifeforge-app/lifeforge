import mime from 'mime-types'
import { createReadStream, createWriteStream, promises as fs } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import pathIsInside from 'path-is-inside'

import { findProjectRoot } from '@lifeforge/configs/node'

import type {
  ProviderSaveOptions,
  StorageGetOptions,
  StorageProvider
} from '../types'

export class LocalStorageProvider implements StorageProvider {
  private basePath: string

  constructor(basePath: string = './storage') {
    this.basePath = path.isAbsolute(basePath)
      ? path.resolve(basePath)
      : path.resolve(findProjectRoot(), basePath)
  }

  private getFilePath(key: string) {
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
  ) {
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

  async get(
    key: string,
    _options?: StorageGetOptions
  ) {
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
        mimeType: mime.lookup(filePath) || 'application/octet-stream',
        size: stat.size
      }
    } catch {
      return null
    }
  }

  async delete(key: string) {
    const filePath = this.getFilePath(key)

    if (!filePath) {
      return
    }

    try {
      await fs.unlink(filePath)
    } catch {
      // Ignore if file does not exist
    }

    const dir = path.dirname(filePath)
    const lastDot = key.lastIndexOf('.')
    const baseName = path.basename(lastDot !== -1 ? key.slice(0, lastDot) : key)
    const thumbPrefix = `${baseName}-thumb-`

    try {
      const files = await fs.readdir(dir)

      for (const file of files) {
        if (file.startsWith(thumbPrefix)) {
          await fs.unlink(path.join(dir, file)).catch(() => {})
        }
      }
    } catch {
      // Ignore errors
    }
  }

  async exists(key: string) {
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
}
