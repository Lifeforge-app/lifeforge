import fs from 'fs'
import path from 'path'
import { type RotatingFileStream, createStream } from 'rotating-file-stream'

import { getConfig } from './config'

let stream: RotatingFileStream | null = null

function ensureLogDir(directory: string): void {
  const logPath = path.resolve(process.cwd(), directory)

  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, { recursive: true })
  }
}

function createLogFilename(time: Date | number, index?: number): string {
  const date = time instanceof Date ? time : time ? new Date(time) : new Date()

  const year = date.getFullYear()

  const month = String(date.getMonth() + 1).padStart(2, '0')

  const day = String(date.getDate()).padStart(2, '0')

  const suffix = index ? `.${index}` : ''

  return `${year}-${month}-${day}${suffix}.log`
}

export function getFileStream(): RotatingFileStream {
  if (stream) return stream

  const config = getConfig()

  ensureLogDir(config.directory)
  stream = createStream(createLogFilename, {
    path: path.resolve(process.cwd(), config.directory),
    size: '10M',
    interval: '1d',
    maxFiles: config.retention,
    compress: 'gzip'
  })

  return stream
}

export function closeFileStream(): void {
  if (stream) {
    stream.end()
    stream = null
  }
}
