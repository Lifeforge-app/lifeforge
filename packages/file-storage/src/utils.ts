import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

export function generateKey(
  moduleId: string,
  table: string,
  field: string,
  ext: string
) {
  const uuid = uuidv4()
  const cleanExt = ext.startsWith('.') ? ext.slice(1) : ext

  return `${moduleId}/${table}/${field}-${uuid}.${cleanExt}`
}

export function generateThumbKey(originalKey: string, size: string) {
  const lastDot = originalKey.lastIndexOf('.')
  const baseKey = lastDot !== -1 ? originalKey.slice(0, lastDot) : originalKey
  const ext = lastDot !== -1 ? originalKey.slice(lastDot) : ''

  return `${baseKey}-thumb-${size}${ext}`
}

export async function resizeImage(buffer: Buffer, sizeStr: string) {
  const [w, h] = sizeStr.toLowerCase().split('x').map(Number)
  const width = w > 0 ? w : undefined
  const height = h > 0 ? h : undefined

  let pipeline = sharp(buffer)

  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit: width && height ? 'cover' : 'inside'
    })
  }

  const resizedBuffer = await pipeline.toBuffer()
  const metadata = await sharp(resizedBuffer).metadata()

  return {
    buffer: resizedBuffer,
    width: metadata.width ?? (width || 0),
    height: metadata.height ?? (height || 0)
  }
}
