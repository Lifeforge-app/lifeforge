import { coreLogger } from '@functions/logging'
import chalk from 'chalk'

import type { StagedFile } from '@lifeforge/file-storage'
import { MediaConfig } from '@lifeforge/server-utils'

type MediaResponse = Record<string, StagedFile | StagedFile[] | undefined>

export const splitMediaAndData = (
  _media: MediaConfig | null,
  data: Record<string, any>,
  requestFiles: Record<string, StagedFile[]>
): {
  data: Record<string, any>
  media: MediaResponse
} => {
  const media: MediaResponse = {}

  const result: Record<string, any> = {}

  for (const key in requestFiles) {
    const config = _media?.[key]

    if (!config) continue

    const files = requestFiles[key]

    if (!files || files.length === 0) {
      media[key] = undefined
    } else if (config.multiple) {
      media[key] = files
    } else {
      media[key] = files[0]
    }
  }

  for (const key in data) {
    if (key in (_media || {})) {
      media[key] = data[key]
    } else {
      result[key] = data[key]
    }
  }

  if (_media) {
    for (const key in _media) {
      const config = _media[key]

      if (config && !media[key]) {
        media[key] = config.multiple ? [] : undefined
      }
    }
  }

  if (Object.keys(media).length !== 0) {
    coreLogger.debug(
      'Received media: ' + chalk.blue(Object.keys(media).join(', '))
    )
  }

  return { data: result, media }
}
