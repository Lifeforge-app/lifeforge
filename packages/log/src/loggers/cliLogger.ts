import chalk from 'chalk'

import { LogLevel } from '@/utils/config'

import { type Logger, createLogger } from './logger'

export interface CLILogger extends Logger {
  success(message?: string): void
  print(message?: string): void
}

function wrapWithCLIMethods(logger: Logger): CLILogger {
  return {
    ...logger,
    get level(): LogLevel {
      return logger.level
    },
    setLevel(level: LogLevel) {
      logger.setLevel(level)
    },
    success(message?: string) {
      if (message === undefined) {
        return
      }

      logger.info(`${chalk.green('✔')} ${message}`)
    },
    print(message?: string) {
      if (message === undefined) {
        return
      }

      logger.info(message)
    },

    child(bindings: object): CLILogger {
      return wrapWithCLIMethods(logger.child(bindings))
    }
  }
}

export function createCLILogger(name = 'CLI', level?: LogLevel): CLILogger {
  const logger = createLogger({
    name,
    pretty: true,
    file: { enabled: true },
    level
  })

  return wrapWithCLIMethods(logger)
}
