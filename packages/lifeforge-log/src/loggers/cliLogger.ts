import chalk from 'chalk'

import { LogLevel } from '@/utils/config'

import { type Logger, createLogger } from './logger'

export interface CLILogger extends Logger {
  success(message: string): void
  print(message: string): void
  actionableError(message: string, suggestion: string): void
}

function wrapWithCLIMethods(logger: Logger): CLILogger {
  return {
    ...logger,
    success(message: string) {
      logger.info(`${chalk.green('✔')} ${message}`)
    },
    print(message: string) {
      logger.info(message)
    },
    actionableError(message: string, suggestion: string) {
      logger.error(message)
      logger.info(
        `${chalk.yellow('→')} ${chalk.dim('Suggestion:')} ${suggestion}`
      )
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
