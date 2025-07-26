import { MediaConfig } from '../typescript/forge_controller.types'

export const splitMediaAndData = (
  _media: MediaConfig,
  data: Record<string, any>,
  requestFiles: Record<string, Express.Multer.File[]>
): {
  data: Record<string, any>
  media: Record<string, string | Express.Multer.File[] | undefined>
} => {
  const media: Record<string, string | Express.Multer.File[] | undefined> = {}
  const result: Record<string, any> = {}

  for (const key in requestFiles) {
    if (key in _media) {
      media[key] = requestFiles[key] || undefined
    }
  }

  for (const key in data) {
    if (key in _media) {
      media[key] = data[key]
    } else {
      result[key] = data[key]
    }
  }

  return { data: result, media }
}
