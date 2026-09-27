import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import mime from 'mime-types'
import { Readable } from 'node:stream'

import type {
  ProviderSaveOptions,
  S3ProviderConfig,
  StorageProvider
} from '../types'

export class S3StorageProvider implements StorageProvider {
  private client: S3Client
  private bucket: string

  constructor(config: S3ProviderConfig) {
    this.bucket = config.bucket
    this.client = new S3Client({
      region: config.region,
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
  ) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body:
          Buffer.isBuffer(data) || data instanceof Readable
            ? data
            : Buffer.from(data),
        ContentType:
          options?.mimeType ?? (mime.lookup(key) || 'application/octet-stream'),
        ContentLength: options?.size
      })
    )
  }

  async get(key: string) {
    try {
      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key
        })
      )

      if (!response.Body) {
        return null
      }

      return {
        stream: response.Body as Readable,
        mimeType:
          response.ContentType ??
          (mime.lookup(key) || 'application/octet-stream'),
        size: response.ContentLength ?? 0
      }
    } catch {
      return null
    }
  }

  async delete(key: string) {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key
        })
      )

      const lastDot = key.lastIndexOf('.')
      const baseKey = lastDot !== -1 ? key.slice(0, lastDot) : key
      const thumbPrefix = `${baseKey}-thumb-`

      let continuationToken: string | undefined

      do {
        const listResult = await this.client.send(
          new ListObjectsV2Command({
            Bucket: this.bucket,
            Prefix: thumbPrefix,
            ContinuationToken: continuationToken
          })
        )

        if (listResult.Contents && listResult.Contents.length > 0) {
          await this.client.send(
            new DeleteObjectsCommand({
              Bucket: this.bucket,
              Delete: {
                Objects: listResult.Contents.map(obj => ({ Key: obj.Key }))
              }
            })
          )
        }

        continuationToken = listResult.NextContinuationToken
      } while (continuationToken)
    } catch {
      // Ignore deletion errors
    }
  }

  async exists(key: string) {
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key
        })
      )

      return true
    } catch {
      return false
    }
  }
}
