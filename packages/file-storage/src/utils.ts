import mime from 'mime-types'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

export function extensionToMime(extOrKey: string): string {
  const mimeType = mime.lookup(extOrKey)

  if (mimeType) {
    return mimeType
  }

  return 'application/octet-stream'
}

export function isImageMime(mimeType: string): boolean {
  return mimeType.startsWith('image/') && !mimeType.includes('svg')
}

export function generateKey(
  moduleId: string,
  table: string,
  field: string,
  ext: string
): string {
  const uuid = uuidv4()
  const cleanExt = ext.startsWith('.') ? ext.slice(1) : ext

  return `${moduleId}/${table}/${field}-${uuid}.${cleanExt}`
}

export function generateThumbKey(originalKey: string, size: string): string {
  const lastDot = originalKey.lastIndexOf('.')
  const baseKey = lastDot !== -1 ? originalKey.slice(0, lastDot) : originalKey
  const ext = lastDot !== -1 ? originalKey.slice(lastDot) : ''

  return `${baseKey}-thumb-${size}${ext}`
}

export function parseThumbSize(sizeStr: string): {
  width?: number
  height?: number
} {
  const parts = sizeStr.toLowerCase().split('x')

  if (parts.length !== 2) {
    return {}
  }

  const w = parseInt(parts[0], 10)
  const h = parseInt(parts[1], 10)

  const result: { width?: number; height?: number } = {}

  if (!isNaN(w) && w > 0) {
    result.width = w
  }

  if (!isNaN(h) && h > 0) {
    result.height = h
  }

  return result
}

export async function resizeImage(
  buffer: Buffer,
  sizeStr: string
): Promise<{ buffer: Buffer; width: number; height: number }> {
  const { width, height } = parseThumbSize(sizeStr)

  let pipeline = sharp(buffer)

  if (width && height) {
    pipeline = pipeline.resize(width, height, { fit: 'cover' })
  } else if (width) {
    pipeline = pipeline.resize(width, null, { fit: 'inside' })
  } else if (height) {
    pipeline = pipeline.resize(null, height, { fit: 'inside' })
  }

  const resizedBuffer = await pipeline.toBuffer()
  const metadata = await sharp(resizedBuffer).metadata()

  return {
    buffer: resizedBuffer,
    width: metadata.width ?? (width || 0),
    height: metadata.height ?? (height || 0)
  }
}
