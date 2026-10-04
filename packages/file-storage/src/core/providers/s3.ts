import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import mime from 'mime-types'
import { Readable } from 'node:stream'

import type {
  ProviderSaveOptions,
  StorageGetOptions,
  StorageProvider
} from './types'

export interface S3ProviderConfig {
  bucket: string
  region?: string
  endpoint?: string
  accessKeyId?: string
  secretAccessKey?: string
  forcePathStyle?: boolean
}

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

  private contentType(key: string, options?: ProviderSaveOptions): string {
    return options?.mimeType || mime.lookup(key) || 'application/octet-stream'
  }

  async save(
    key: string,
    data: Readable,
    options?: ProviderSaveOptions
  ) {
    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: data,
        ContentType: this.contentType(key, options)
      }
    })

    await upload.done()
  }

  async get(key: string, _options?: StorageGetOptions) {
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

}
