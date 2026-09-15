import { LocalStorageProvider } from './providers/local'
import { S3StorageProvider } from './providers/s3'
import type { StorageProvider } from './types'

export function createProvider(): StorageProvider {
  const providerType = process.env.FILE_STORAGE_PROVIDER || 'local'

  if (providerType === 's3') {
    const bucket = process.env.FILE_STORAGE_S3_BUCKET

    if (!bucket) {
      throw new Error(
        'FILE_STORAGE_S3_BUCKET is required when using S3 storage provider'
      )
    }

    return new S3StorageProvider({
      bucket,
      region: process.env.FILE_STORAGE_S3_REGION,
      endpoint: process.env.FILE_STORAGE_S3_ENDPOINT,
      accessKeyId: process.env.FILE_STORAGE_S3_ACCESS_KEY,
      secretAccessKey: process.env.FILE_STORAGE_S3_SECRET_KEY,
      forcePathStyle: process.env.FILE_STORAGE_S3_FORCE_PATH_STYLE === 'true'
    })
  }

  const localPath = process.env.FILE_STORAGE_LOCAL_PATH || './storage'

  return new LocalStorageProvider(localPath)
}
