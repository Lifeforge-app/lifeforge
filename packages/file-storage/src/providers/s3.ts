import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { Readable } from 'node:stream'

import type {
  FileStream,
  ProviderSaveOptions,
  StorageConfig,
  StorageProvider
} from '../types'
import { extensionToMime } from '../utils'

export class S3StorageProvider implements StorageProvider {
  private client: S3Client
  private bucket: string

  constructor(config: NonNullable<StorageConfig['s3']>) {
    this.bucket = config.bucket
    this.client = new S3Client({
      region: config.region ?? 'us-east-1',
      endpoint: config.endpoint,
      forcePathStyle: config.forcePathStyle ?? false,
      credentials:
        config.accessKeyId && config.secretAccessKey
          ? {
              accessKeyId: config.accessKeyId,
              secretAccessKey: config.secretAccessKey
            }
          : undefined
    })
  }

  async save(
    key: string,
    data: Buffer | Readable,
    options?: ProviderSaveOptions
  ): Promise<void> {
    let body: Buffer | Uint8Array | Readable = data

    if (!Buffer.isBuffer(data) && !(data instanceof Readable)) {
      body = Buffer.from(data)
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: options?.mimeType ?? extensionToMime(key),
      ContentLength: options?.size
    })

    await this.client.send(command)
  }

  async get(key: string): Promise<FileStream | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key
      })
      const response = await this.client.send(command)

      if (!response.Body) {
        return null
      }

      const stream = response.Body as Readable

      return {
        stream,
        mimeType: response.ContentType ?? extensionToMime(key),
        size: response.ContentLength ?? 0
      }
    } catch {
      return null
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key
      })
      await this.client.send(command)
    } catch {
      // Ignore deletion errors
    }
  }

  async deletePrefix(prefix: string): Promise<void> {
    try {
      let continuationToken: string | undefined

      do {
        const listCommand = new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken
        })

        const listResult = await this.client.send(listCommand)

        if (listResult.Contents && listResult.Contents.length > 0) {
          const deleteCommand = new DeleteObjectsCommand({
            Bucket: this.bucket,
            Delete: {
              Objects: listResult.Contents.map(obj => ({ Key: obj.Key }))
            }
          })
          await this.client.send(deleteCommand)
        }

        continuationToken = listResult.NextContinuationToken
      } while (continuationToken)
    } catch {
      // Ignore errors
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key
      })
      await this.client.send(command)

      return true
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

    return `/api/files?${params.toString()}`
  }
}
