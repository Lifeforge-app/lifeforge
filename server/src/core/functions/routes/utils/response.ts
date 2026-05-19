import { createLogger } from '@lifeforge/log'
import { BaseResponse } from '@lifeforge/server-utils'
import chalk from 'chalk'
import { Response } from 'express'
import fs from 'fs/promises'
import path from 'path'

const cleanupLogger = createLogger({ name: 'cleanup' })

/**
 * Asynchronously clean up temporary files in the 'medium' directory
 * This is non-blocking and errors are logged but don't affect the response
 */
async function cleanupTempFiles(): Promise<void> {
  const mediumDir = 'medium'

  try {
    // Check if directory exists first
    await fs.access(mediumDir).catch(() => {
      // Directory doesn't exist, nothing to clean up
      return
    })

    const files = await fs.readdir(mediumDir)

    await Promise.all(
      files.map(async file => {
        const filePath = path.join(mediumDir, file)
        try {
          const stat = await fs.stat(filePath)
          if (stat.isFile()) {
            await fs.unlink(filePath)
          } else if (stat.isDirectory()) {
            await fs.rm(filePath, { recursive: true, force: true })
          }
        } catch (error) {
          cleanupLogger.warn(`Failed to clean up temp file: ${filePath}`, {
            error: error instanceof Error ? error.message : String(error)
          })
        }
      })
    )
  } catch (error) {
    cleanupLogger.error('Failed to clean up temp files', {
      error: error instanceof Error ? error.message : String(error)
    })
  }
}

interface ClientErrorOptions {
  res: Response
  message?: string | object
  code?: number
  moduleName?: string
  skipCleanup?: boolean
}

export function clientError({
  res,
  message = 'Bad Request',
  code = 400,
  moduleName = 'unknown-module',
  skipCleanup = false
}: ClientErrorOptions): void {
  const logger = createLogger({ name: moduleName || 'unknown-module' })

  // Perform cleanup asynchronously without blocking response
  if (!skipCleanup) {
    cleanupTempFiles().catch(() => {
      // Cleanup errors are already logged, ignore here
    })
  }

  const messageStr =
    typeof message === 'string' ? message : JSON.stringify(message)

  try {
    logger.error(chalk.red(messageStr))

    res.status(code).json({
      state: 'error',
      message: messageStr
    })
  } catch (error) {
    logger.error('Failed to send error response', {
      error: error instanceof Error ? error.message : String(error),
      originalMessage: messageStr
    })
    // Try to end the response if possible
    try {
      res.end()
    } catch {
      // Response already closed or unavailable
    }
  }
}

export function serverError(
  res: Response,
  err?: string,
  moduleName?: string,
  skipCleanup = false
): void {
  const logger = createLogger({ name: moduleName || 'unknown-module' })

  // Perform cleanup asynchronously without blocking response
  if (!skipCleanup) {
    cleanupTempFiles().catch(() => {
      // Cleanup errors are already logged, ignore here
    })
  }

  const errorMessage = err || 'Internal server error'

  try {
    logger.error(chalk.red(errorMessage))

    res.status(500).json({
      state: 'error',
      message: errorMessage
    })
  } catch (error) {
    logger.error('Failed to send server error response', {
      error: error instanceof Error ? error.message : String(error),
      originalError: errorMessage
    })
    // Try to end the response if possible
    try {
      res.end()
    } catch {
      // Response already closed or unavailable
    }
  }
}

export function success<T>(
  res: Response<BaseResponse<T>>,
  data: T,
  statusCode: number = 200
): void {
  const logger = createLogger({ name: 'response' })

  try {
    res.status(statusCode).json({
      state: 'success',
      data: data
    })
  } catch (error) {
    logger.error('Failed to send success response', {
      error: error instanceof Error ? error.message : String(error),
      statusCode
    })
    // Try to end the response if possible
    try {
      res.end()
    } catch {
      // Response already closed or unavailable
    }
  }
}
