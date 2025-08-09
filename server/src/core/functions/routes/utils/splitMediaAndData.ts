import { MediaConfig } from '../typescript/forge_controller.types'

type MediaResponse = Record<
  string,
  Express.Multer.File | Express.Multer.File[] | undefined
>

export const splitMediaAndData = (
  _media: MediaConfig | null,
  data: Record<string, any>,
  requestFiles: Record<string, Express.Multer.File[]>
): {
  data: Record<string, any>
  media: MediaResponse
} => {
  const media: MediaResponse = {}

  const result: Record<string, any> = {}

  for (const key in requestFiles) {
    if (key in (_media || {})) {
      if (!requestFiles[key] || requestFiles[key].length === 0) {
        media[key] = undefined
      }

      if (_media![key].multiple) {
        media[key] = requestFiles[key]
      } else {
        media[key] = requestFiles[key][0]
      }
    }
  }

  for (const key in data) {
    if (key in (_media || {})) {
      media[key] = data[key]
    } else {
      result[key] = data[key]
    }
  }

  for (const key in _media) {
    if (!media[key]) {
      media[key] = _media[key].multiple ? [] : undefined
    }
  }

  return { data: result, media }
}
