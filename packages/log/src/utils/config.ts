export const LOG_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'] as const

export type LogLevel = (typeof LOG_LEVELS)[number]

export interface FileOptions {
  enabled?: boolean
  directory?: string
  maxSize?: string
  retention?: number
}

export interface LoggerOptions {
  name: string
  level?: LogLevel
  pretty?: boolean
  file?: FileOptions
}

export interface LogConfig {
  level: LogLevel
  directory: string
  retention: number
  isProduction: boolean
}

function getLogLevel(): LogLevel {
  const level = process.env.LOG_LEVEL?.toLowerCase()

  if (level && LOG_LEVELS.includes(level as LogLevel)) {
    return level as LogLevel
  }

  return 'info'
}

export function getConfig(): LogConfig {
  return {
    level: getLogLevel(),
    directory: process.env.LOG_DIR || 'logs',
    retention: Number(process.env.LOG_RETENTION_DAYS) || 7,
    isProduction: process.env.NODE_ENV === 'production'
  }
}
