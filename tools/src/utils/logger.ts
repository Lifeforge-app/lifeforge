import { type LogLevel } from '@lifeforge/log'
import { type CLILogger, createCLILogger } from '@lifeforge/log/cli'

let loggerInstance: CLILogger | null = null

function getLogger(): CLILogger {
  if (!loggerInstance) {
    loggerInstance = createCLILogger()
  }

  return loggerInstance
}

export function setLogLevel(level: LogLevel): void {
  const logger = getLogger()

  logger.setLevel(level)
}

const logger = getLogger()

export default logger
