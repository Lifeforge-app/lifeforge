import { createLogger } from '@lifeforge/log'
import chalk from 'chalk'
import { Response } from 'express'
import fs from 'fs'

export interface BaseResponse<T = ''> {
  data?: T
  state: 'success' | 'error' | 'accepted'
  message?: string
}

export function clientError({
  res,
  message = 'Bad Request',
  code = 400,
  moduleName = 'unknown-module'
}: {
  res: Response
  message?: any
  code?: number
  moduleName?: string
}) {
  const logger = createLogger({ name: moduleName || 'unknown-module' })

  fs.readdirSync('medium').forEach(file => {
    if (fs.statSync('medium/' + file).isFile()) {
      fs.unlinkSync('medium/' + file)
    } else {
      fs.rmdirSync('medium/' + file, { recursive: true })
    }
  })

  try {
    logger.error(
      chalk.red(typeof message === 'string' ? message : JSON.stringify(message))
    )

    res.status(code).json({
      state: 'error',
      message
    })
  } catch {
    console.error('Failed to send response')
  }
}

export function serverError(res: Response, err?: string, moduleName?: string) {
  const logger = createLogger({ name: moduleName || 'unknown-module' })

  fs.readdirSync('medium').forEach(file => {
    if (fs.statSync('medium/' + file).isFile()) {
      fs.unlinkSync('medium/' + file)
    } else {
      fs.rmdirSync('medium/' + file, { recursive: true })
    }
  })

  try {
    logger.error(chalk.red(err))

    res.status(500).json({
      state: 'error',
      message: err || 'Internal server error'
    })
  } catch {
    console.error('Failed to send response')
  }
}

export function success<T>(
  res: Response<BaseResponse<T>>,
  data: T,
  statusCode: number = 200
) {
  try {
    res.status(statusCode).json({
      state: 'success',
      data: data
    })
  } catch {
    console.error('Failed to send response')
  }
}
