/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore- Lazy to fix the TS config stuff
import { LoggingService } from '@server/core/functions/logging/loggingService'
import chalk from 'chalk'

const LEVEL_ORDER = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5
}

/**
 * CLI Logging service that wraps the server's LoggingService
 * Provides consistent logging across the entire CLI with file persistence
 */
export default class CLILoggingService {
  private static readonly SERVICE_NAME = 'CLI'
  private static level: number = LEVEL_ORDER['info']

  static setLevel(level: keyof typeof LEVEL_ORDER): void {
    CLILoggingService.level = LEVEL_ORDER[level]
  }

  /**
   * Log an informational message
   */
  static info(message: string): void {
    if (CLILoggingService.level > LEVEL_ORDER['info']) {
      return
    }

    LoggingService.info(message, this.SERVICE_NAME)
  }

  /**
   * Log an error message with consistent formatting
   */
  static error(message: string, details?: string): void {
    if (CLILoggingService.level > LEVEL_ORDER['error']) {
      return
    }

    const formattedMessage = details ? `${message}: ${details}` : message

    LoggingService.error(formattedMessage, this.SERVICE_NAME)
  }

  /**
   * Log a warning message
   */
  static warn(message: string): void {
    if (CLILoggingService.level > LEVEL_ORDER['warn']) {
      return
    }

    LoggingService.warn(message, this.SERVICE_NAME)
  }

  /**
   * Log a debug message
   */
  static debug(message: string): void {
    if (CLILoggingService.level > LEVEL_ORDER['debug']) {
      return
    }

    LoggingService.debug(message, this.SERVICE_NAME)
  }

  /**
   * Log a success message with green checkmark
   */
  static success(message: string): void {
    if (CLILoggingService.level > LEVEL_ORDER['info']) {
      return
    }

    LoggingService.info(chalk.green(`${message}`), this.SERVICE_NAME)
  }

  /**
   * Log a step in a process with consistent formatting
   */
  static step(message: string): void {
    if (CLILoggingService.level > LEVEL_ORDER['info']) {
      return
    }

    LoggingService.info(chalk.blue(`${message}`), this.SERVICE_NAME)
  }

  /**
   * Log a process start with spinner-like indicator
   */
  static progress(message: string): void {
    if (CLILoggingService.level > LEVEL_ORDER['info']) {
      return
    }

    LoggingService.info(chalk.magenta(`${message}...`), this.SERVICE_NAME)
  }

  /**
   * Display a formatted list of items
   */
  static list(title: string, items: string[]): void {
    if (CLILoggingService.level > LEVEL_ORDER['info']) {
      return
    }

    this.info(title)
    this.newline()
    items.forEach((item, index) => {
      console.log(
        `  ${chalk.cyan((index + 1).toString().padStart(2))}. ${chalk.white(item)}`
      )
    })
    this.newline()
  }

  /**
   * Display available options in a formatted way
   */
  static options(title: string, options: string[]): void {
    if (CLILoggingService.level > LEVEL_ORDER['error']) {
      return
    }

    this.error(title)
    this.error(`Available options: ${options.join(', ')}`)
  }

  /**
   * Add a visual separator/newline for better readability
   */
  static newline(): void {
    if (CLILoggingService.level > LEVEL_ORDER['info']) {
      return
    }

    console.log()
  }

  /**
   * Log a fatal error and exit the process
   */
  static fatal(message: string, exitCode = 1): never {
    if (CLILoggingService.level > LEVEL_ORDER['fatal']) {
      process.exit(exitCode)
    }

    this.error(chalk.red(`Fatal: ${message}`))
    process.exit(exitCode)
  }

  /**
   * Log an actionable error with next steps
   */
  static actionableError(message: string, suggestion: string): void {
    if (CLILoggingService.level > LEVEL_ORDER['error']) {
      return
    }

    this.error(chalk.red(message))
    this.info(chalk.yellow(`Suggestion: ${suggestion}`))
  }
}
