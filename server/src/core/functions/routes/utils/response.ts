import { Response } from 'express'
import fs from 'fs'

import { BaseResponse } from '../typescript/forge_controller.types'

export class ClientError extends Error {
  code: number

  constructor(message: any, code: number = 400) {
    super(message)
    this.name = 'ClientError'
    this.code = code
    Object.setPrototypeOf(this, ClientError.prototype)
  }

  static isClientError(error: unknown): error is ClientError {
    return error instanceof ClientError
  }
}

export function successWithBaseResponse<T>(
  res: Response<BaseResponse<T>>,
  data: T
) {
  try {
    res.json({
      state: 'success',
      data: data
    })
  } catch {
    console.error('Failed to send response')
  }
}

export function clientError(
  res: Response,
  message: any = 'Bad Request',
  code = 400
) {
  fs.readdirSync('medium').forEach(file => {
    if (fs.statSync('medium/' + file).isFile()) {
      fs.unlinkSync('medium/' + file)
    } else {
      fs.rmdirSync('medium/' + file, { recursive: true })
    }
  })

  try {
    res.status(code).json({
      state: 'error',
      message
    })
  } catch {
    console.error('Failed to send response')
  }
}

export function serverError(res: Response, message = 'Internal Server Error') {
  fs.readdirSync('medium').forEach(file => {
    if (fs.statSync('medium/' + file).isFile()) {
      fs.unlinkSync('medium/' + file)
    } else {
      fs.rmdirSync('medium/' + file, { recursive: true })
    }
  })

  try {
    res.status(500).json({
      state: 'error',
      message
    })
  } catch {
    console.error('Failed to send response')
  }
}
