/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore- Lazy to fix the TS config stuff
import { LoggingService } from '@server/core/functions/logging/loggingService'
import chalk from 'chalk'

/**
 * CLI Logging service that wraps the server's LoggingService
 * Provides consistent logging across the entire CLI with file persistence
 */
export class CLILoggingService {
  private static readonly SERVICE_NAME = 'CLI'

  /**
   * Log an informational message
   */
  static info(message: string): void {
    LoggingService.info(message, this.SERVICE_NAME)
  }

  /**
   * Log an error message with consistent formatting
   */
  static error(message: string, details?: string): void {
    const formattedMessage = details ? `${message}: ${details}` : message

    LoggingService.error(formattedMessage, this.SERVICE_NAME)
  }

  /**
   * Log a warning message
   */
  static warn(message: string): void {
    LoggingService.warn(message, this.SERVICE_NAME)
  }

  /**
   * Log a debug message
   */
  static debug(message: string): void {
    LoggingService.debug(message, this.SERVICE_NAME)
  }

  /**
   * Log a success message with green checkmark
   */
  static success(message: string): void {
    LoggingService.info(chalk.green(`${message}`), this.SERVICE_NAME)
  }

  /**
   * Log a step in a process with consistent formatting
   */
  static step(message: string): void {
    LoggingService.info(chalk.blue(`${message}`), this.SERVICE_NAME)
  }

  /**
   * Log a process start with spinner-like indicator
   */
  static progress(message: string): void {
    LoggingService.info(chalk.magenta(`${message}...`), this.SERVICE_NAME)
  }

  /**
   * Display a formatted list of items
   */
  static list(title: string, items: string[]): void {
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
    this.error(title)
    this.error(`Available options: ${options.join(', ')}`)
  }

  /**
   * Add a visual separator/newline for better readability
   */
  static newline(): void {
    console.log()
  }

  /**
   * Log a fatal error and exit the process
   */
  static fatal(message: string, exitCode = 1): never {
    this.error(chalk.red(`Fatal: ${message}`))
    process.exit(exitCode)
  }

  /**
   * Log an actionable error with next steps
   */
  static actionableError(message: string, suggestion: string): void {
    this.error(chalk.red(message))
    this.info(chalk.yellow(`Suggestion: ${suggestion}`))
  }
}
