import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'medium/')
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}.${file.originalname.split('.').pop()}`)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 100000000
  }
})

const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload.array('files', 100)(req, res, () => {
    next()
  })
}

const singleUploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single('file')(req, res, () => {
    next()
  })
}

const singleUploadMiddlewareOfKey =
  (key: string) => (req: Request, res: Response, next: NextFunction) => {
    upload.single(key)(req, res, () => {
      next()
    })
  }

const fieldsUploadMiddleware =
  (fields: Record<string, number>) =>
  (req: Request, res: Response, next: NextFunction) => {
    upload.fields(
      Object.entries(fields).map(([name, maxCount]) => ({ name, maxCount }))
    )(req, res, () => {
      next()
    })
  }

export {
  fieldsUploadMiddleware,
  singleUploadMiddleware,
  singleUploadMiddlewareOfKey,
  uploadMiddleware
}
