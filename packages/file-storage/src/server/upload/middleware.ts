import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import type { Readable } from 'node:stream'

import type { StagedFile } from '../../core/types'
import { releaseStaged, stageStream } from './staging'

/**
 * Custom multer engine that stages each upload in a temp file (the "middle
 * place") instead of writing it to the provider. `FileStorage.save` commits it
 * later, optionally after the callback pre-processes it.
 */
function createStagingStorage(): multer.StorageEngine {
  return {
    _handleFile(_req, file, cb) {
      void (async () => {
        try {
          const nodeStream = (file as unknown as { stream: Readable }).stream
          const staged = await stageStream(
            nodeStream,
            file.originalname,
            file.mimetype
          )

          cb(null, staged as unknown as Express.Multer.File)
        } catch (err) {
          cb(err as Error)
        }
      })()
    },

    _removeFile(req, file, cb) {
      releaseStaged(file as unknown as StagedFile).then(
        () => cb(null),
        err => cb(err)
      )
    }
  }
}

const fieldsUploadMiddleware =
  (fields: Record<string, number>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const upload = multer({
      storage: createStagingStorage(),
      limits: {
        fileSize: Number(process.env.FILE_UPLOAD_MAX_BYTES) || 2 * 1024 ** 3
      }
    })

    upload.fields(
      Object.entries(fields).map(([name, maxCount]) => ({
        name,
        maxCount
      }))
    )(req, res, () => {
      next()
    })
  }

export default fieldsUploadMiddleware
