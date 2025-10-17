import chalk from 'chalk'
import fs from 'fs'
import moment from 'moment'
import { stripVTControlCharacters } from 'util'

const logPath = process.cwd().replace(/\/server$/, '') + '/logs'

if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath)
}

const LOGGING_SEVERITY_COLOR = {
  INFO: '#34ace0',
  ERROR: '#ff5252',
  WARN: '#ffb142',
  DEBUG: '#9b59b6'
}

export class LoggingService {
  private getPrefix(
    category: keyof typeof LOGGING_SEVERITY_COLOR,
    service?: string
  ): string {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss')

    return `${chalk.hex(`[${LOGGING_SEVERITY_COLOR[category]}]`).bold(category)}${' '.repeat(5 - category.length)} ${timestamp} |${service ? ` ${chalk.hex('#ffb142').bold(`[${service}]`)}` : ''}`
  }

  private logToFile(message: string): void {
    const logFile = `${logPath}/${moment().format('YYYY-MM-DD')}.log`

    fs.appendFileSync(logFile, `${stripVTControlCharacters(message)}\n`)
  }

  public static error(message: string, service?: string): void {
    const instance = new LoggingService()

    const prefix = instance.getPrefix('ERROR', service)

    console.error(`${prefix} ${chalk.red(message)}`)

    instance.logToFile(`${prefix} ${message}`)
  }

  public static warn(message: string, service?: string): void {
    const instance = new LoggingService()

    const prefix = instance.getPrefix('WARN', service)

    console.warn(`${prefix} ${chalk.yellow(message)}`)

    instance.logToFile(`${prefix} ${message}`)
  }

  public static info(message: string, service?: string): void {
    const instance = new LoggingService()

    const prefix = instance.getPrefix('INFO', service)

    console.info(`${prefix} ${message}`)

    instance.logToFile(`${prefix} ${message}`)
  }

  public static debug(message: string, service?: string): void {
    const instance = new LoggingService()

    const prefix = instance.getPrefix('DEBUG', service)

    console.debug(`${prefix} ${message}`)

    instance.logToFile(`${prefix} ${message}`)
  }
}
