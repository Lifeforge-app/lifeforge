import { LoggingService } from '@server/core/functions/logging/loggingService'

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
   * Log an error message
   */
  static error(message: string): void {
    LoggingService.error(message, this.SERVICE_NAME)
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
}
