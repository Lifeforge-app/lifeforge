/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore- Lazy to fix the TS config stuff
import { LoggingService } from '@server/core/functions/logging/loggingService'
import chalk from 'chalk'

export const LOG_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'] as const

export const LEVEL_ORDER = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5
}

type LogLevel = keyof typeof LEVEL_ORDER

/**
 * CLI Logging service that wraps the server's LoggingService
 * Provides consistent logging across the entire CLI with file persistence
 */
export default class Logging {
  private static readonly SERVICE_NAME = 'CLI'
  public static level: number = LEVEL_ORDER['info']

  static setLevel(level: LogLevel): void {
    Logging.level = LEVEL_ORDER[level]
  }

  // ─────────────────────────────────────────────────────────────
  // Formatting Utilities
  // ─────────────────────────────────────────────────────────────

  /** Format text as bold */
  static bold(text: string): string {
    return chalk.bold(text)
  }

  /** Format text as dim/muted */
  static dim(text: string): string {
    return chalk.dim(text)
  }

  /** Format text as highlighted (bold blue) - for important values */
  static highlight(text: string): string {
    return chalk.bold.blue(text)
  }

  /** Format text as green - for success/positive items */
  static green(text: string): string {
    return chalk.green(text)
  }

  /** Format text as yellow - for warnings */
  static yellow(text: string): string {
    return chalk.yellow(text)
  }

  /** Format text as red - for errors */
  static red(text: string): string {
    return chalk.red(text)
  }

  /** Format text as cyan - for info/neutral items */
  static cyan(text: string): string {
    return chalk.cyan(text)
  }

  // ─────────────────────────────────────────────────────────────
  // Core Logging Methods
  // ─────────────────────────────────────────────────────────────

  /**
   * Log an informational message
   */
  static info(message: string): void {
    if (Logging.level > LEVEL_ORDER['info']) {
      return
    }

    LoggingService.info(message, this.SERVICE_NAME)
  }

  /**
   * Log an error message with consistent formatting
   */
  static error(message: string, details?: string): void {
    if (Logging.level > LEVEL_ORDER['error']) {
      return
    }

    const formattedMessage = details ? `${message}: ${details}` : message

    LoggingService.error(formattedMessage, this.SERVICE_NAME)
  }

  /**
   * Log a warning message
   */
  static warn(message: string): void {
    if (Logging.level > LEVEL_ORDER['warn']) {
      return
    }

    LoggingService.warn(message, this.SERVICE_NAME)
  }

  /**
   * Log a debug message
   */
  static debug(message: string): void {
    if (Logging.level > LEVEL_ORDER['debug']) {
      return
    }

    LoggingService.debug(message, this.SERVICE_NAME)
  }

  /**
   * Log a success message with green checkmark
   */
  static success(message: string): void {
    if (Logging.level > LEVEL_ORDER['info']) {
      return
    }

    LoggingService.info(`${chalk.green('✔')} ${message}`, this.SERVICE_NAME)
  }

  /**
   * Print raw output without log prefix (for lists, tables, etc.)
   * Respects log level - only prints if info level is enabled
   */
  static print(message: string): void {
    if (Logging.level > LEVEL_ORDER['info']) {
      return
    }

    console.log(message)
  }

  /**
   * Log an actionable error with next steps
   */
  static actionableError(message: string, suggestion: string): void {
    if (Logging.level > LEVEL_ORDER['error']) {
      return
    }

    this.error(chalk.red(message))
    this.info(chalk.yellow(`Suggestion: ${suggestion}`))
  }
}
