import { ClientError, ConvertMedia, MediaConfig } from '@lifeforge/server-utils'
import { Request } from 'express'
import z from 'zod'

import { decryptPayload } from '@functions/encryption'

import restoreFormDataType from './restoreDataType'
import { splitMediaAndData } from './splitMediaAndData'

export default function parseBodyPayload<TMedia extends MediaConfig>(
  req: Request,
  mediaConfig: TMedia,
  isEncrypted: boolean,
  validator?: z.ZodTypeAny
) {
  // Handles body data that is encrypted
  if (isEncrypted) {
    req.body = decryptPayload(req.body)
  }

  // Handles body data that contain media files
  const { data, media } = splitMediaAndData(
    mediaConfig,
    req.body,
    (req.files || {}) as Record<string, Express.Multer.File[]>
  )

  const finalMedia = media as ConvertMedia<TMedia>

  for (const [key, value] of Object.entries(mediaConfig)) {
    if (!value.optional && !finalMedia[key]) {
      throw new ClientError(`Missing required media field "${key}"`, 400)
    }
  }

  const finalData = req.is('multipart/form-data')
    ? Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          restoreFormDataType(value)
        ])
      )
    : data

  if (!validator) {
    req.body = finalData as any
    req.media = finalMedia

    return
  }

  const result = validator.safeParse(finalData)

  if (!result.success) {
    throw new ClientError(z.formatError(result.error).toString(), 400)
  }

  req.body = result.data as any
  req.media = finalMedia
}
