import { LocalStorageProvider } from './providers/local'
import { S3StorageProvider } from './providers/s3'
import type { StorageConfig, StorageProvider } from './types'

export function createProvider(
  config?: Partial<StorageConfig>
): StorageProvider {
  const providerType =
    config?.provider ??
    (process.env.FILE_STORAGE_PROVIDER as 's3' | 'local') ??
    'local'

  if (providerType === 's3') {
    const bucket = config?.s3?.bucket ?? process.env.FILE_STORAGE_S3_BUCKET

    if (!bucket) {
      throw new Error(
        'FILE_STORAGE_S3_BUCKET is required when using S3 storage provider'
      )
    }

    return new S3StorageProvider({
      bucket,
      region:
        config?.s3?.region ?? process.env.FILE_STORAGE_S3_REGION ?? 'us-east-1',
      endpoint: config?.s3?.endpoint ?? process.env.FILE_STORAGE_S3_ENDPOINT,
      accessKeyId:
        config?.s3?.accessKeyId ?? process.env.FILE_STORAGE_S3_ACCESS_KEY,
      secretAccessKey:
        config?.s3?.secretAccessKey ?? process.env.FILE_STORAGE_S3_SECRET_KEY,
      forcePathStyle:
        config?.s3?.forcePathStyle ??
        process.env.FILE_STORAGE_S3_FORCE_PATH_STYLE === 'true'
    })
  }

  const localPath =
    config?.local?.path ?? process.env.FILE_STORAGE_LOCAL_PATH ?? './storage'

  return new LocalStorageProvider(localPath)
}
