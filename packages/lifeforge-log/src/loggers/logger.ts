import chalk from 'chalk'
import pino from 'pino'
import pretty from 'pino-pretty'
import { Transform } from 'stream'

import { LogLevel, LoggerOptions, getConfig } from '../utils/config'
import { getFileStream } from '../utils/fileTransport'

const PRETTY_OPTIONS = {
  colorize: true,
  translateTime: 'yyyy-mm-dd HH:MM:ss',
  ignore: 'pid,hostname,service,name',
  sync: true,
  messageFormat: (log: Record<string, unknown>, messageKey: string) => {
    const msg = log[messageKey] as string

    const name = log.name as string | undefined

    const service = log.service as string | undefined

    let output = ''

    if (name) {
      output += `${chalk.magenta(`(${name})`)}: `
    }

    if (service) {
      output += `${chalk.cyan(`[${service}]`)} `
    }

    output += msg

    return output
  },
  levelFirst: true,
  customColors:
    'fatal:bgRed,error:red,warn:yellow,info:blue,debug:magenta,message:reset',
  customLevels: 'fatal:60,error:50,warn:40,info:30,debug:20'
}

function stripAnsiCodes(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, '')
}

function createStripAnsiTransform(): Transform {
  return new Transform({
    transform(chunk, encoding, callback) {
      try {
        const line = chunk.toString().trim()

        if (!line) {
          callback(null, chunk)

          return
        }

        const log = JSON.parse(line)

        // Strip ANSI codes from the msg field
        if (log.msg && typeof log.msg === 'string') {
          log.msg = stripAnsiCodes(log.msg)
        }

        callback(null, JSON.stringify(log) + '\n')
      } catch {
        // If not JSON, just strip ANSI codes from the entire chunk
        callback(null, stripAnsiCodes(chunk.toString()))
      }
    }
  })
}

export interface Logger {
  instance: pino.Logger
  level: LogLevel
  setLevel(level: LogLevel): void
  debug(message: string, meta?: object): void
  info(message: string, meta?: object): void
  warn(message: string, meta?: object): void
  error(message: string, meta?: object): void
  fatal(message: string, meta?: object): void
  child(bindings: object): Logger
}

// Shared file stream with ANSI stripping - singleton pattern
let sharedFileStream: Transform | null = null

function getSharedFileStream(): Transform {
  if (sharedFileStream) return sharedFileStream

  sharedFileStream = createStripAnsiTransform()
  sharedFileStream.pipe(getFileStream())

  return sharedFileStream
}

function createPinoLogger(options: LoggerOptions): pino.Logger {
  const config = getConfig()

  const level = options.level ?? config.level

  const isPretty = options.pretty ?? !config.isProduction

  const fileEnabled = options.file?.enabled ?? true

  const streams: pino.StreamEntry[] = []

  if (isPretty) {
    streams.push({
      level: 'trace',
      stream: pretty(PRETTY_OPTIONS)
    })
  } else {
    streams.push({
      level: 'trace',
      stream: process.stdout
    })
  }

  if (fileEnabled) {
    streams.push({
      level: 'trace',
      stream: getSharedFileStream()
    })
  }

  return pino(
    {
      level,
      base: { name: options.name },
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: {
        level: label => ({ level: label.toUpperCase() })
      }
    },
    pino.multistream(streams)
  )
}

function wrapPinoLogger(pinoLogger: pino.Logger): Logger {
  return {
    instance: pinoLogger,
    get level(): LogLevel {
      return pinoLogger.level as LogLevel
    },
    setLevel(level: LogLevel) {
      pinoLogger.level = level
    },
    debug(message: string, meta?: object) {
      pinoLogger.debug(meta ?? {}, message)
    },
    info(message: string, meta?: object) {
      pinoLogger.info(meta ?? {}, message)
    },
    warn(message: string, meta?: object) {
      pinoLogger.warn(meta ?? {}, message)
    },
    error(message: string, meta?: object) {
      pinoLogger.error(meta ?? {}, message)
    },
    fatal(message: string, meta?: object) {
      pinoLogger.fatal(meta ?? {}, message)
    },
    child(bindings: object): Logger {
      return wrapPinoLogger(pinoLogger.child(bindings))
    }
  }
}

export function createLogger(options: LoggerOptions): Logger {
  const pinoLogger = createPinoLogger(options)

  return wrapPinoLogger(pinoLogger)
}
