import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'medium/')
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 100000000
  }
})

const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload.array('files', 100)(req, res, err => {
    next()
  })
}

const singleUploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single('file')(req, res, err => {
    next()
  })
}

const singleUploadMiddlewareOfKey =
  (key: string) => (req: Request, res: Response, next: NextFunction) => {
    upload.single(key)(req, res, err => {
      next()
    })
  }

function fieldsUploadMiddleware(
  this: { fields: { name: string; maxCount: number }[] },
  req: Request,
  res: Response,
  next: NextFunction
) {
  upload.fields(this.fields ?? [])(req, res, err => {
    next()
  })
}

export {
  fieldsUploadMiddleware,
  singleUploadMiddleware,
  singleUploadMiddlewareOfKey,
  uploadMiddleware
}
