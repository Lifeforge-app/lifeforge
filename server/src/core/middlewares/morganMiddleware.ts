import { LoggingService } from '@functions/logging/loggingService'
import chalk from 'chalk'
import { Request, Response } from 'express'
import morgan from 'morgan'

const METHOD_COLOR = {
  GET: '#34ace0',
  POST: '#2ed573'
}

const RESPONSE_TIME_COLOR = {
  fast: '#2ed573',
  medium: '#ffb142',
  slow: '#ff5252'
}

const STATUS_COLOR = {
  '1': '#34ace0',
  '2': '#2ed573',
  '3': '#7571f5ff',
  '4': '#ffb142',
  '5': '#ff5252'
}

const m =
  process.env.NODE_ENV !== 'test'
    ? morgan((tokens: any, req, res) => {
        const method = tokens.method(req, res)

        const responseTime = tokens['response-time'](req, res)

        const status = tokens.status(req, res)

        const url = new URL(`http://localhost:3636${tokens.url(req, res)}`)

        const color =
          METHOD_COLOR[method as keyof typeof METHOD_COLOR] || '#ffffff'

        const responseTimeColor =
          responseTime < 100
            ? RESPONSE_TIME_COLOR.fast
            : responseTime < 500
              ? RESPONSE_TIME_COLOR.medium
              : RESPONSE_TIME_COLOR.slow

        const statusColor =
          STATUS_COLOR[status?.toString()?.[0] as keyof typeof STATUS_COLOR] ||
          '#ffffff'

        LoggingService.info(
          [
            chalk.hex(color).bold(method),
            `${url.pathname.split('/').slice(0, -1).join('/')}/${chalk
              .hex('#afed3c')
              .bold(
                url.pathname.split('/').pop() || ''
              )}${chalk.hex('#828282')(url.search)}`,
            chalk.hex(statusColor).bold(tokens.status(req, res)),
            chalk
              .hex(responseTimeColor)
              .bold(`${tokens['response-time'](req, res)} ms`)
          ].join(' '),
          'API'
        )

        return undefined
      })
    : (req: Request, res: Response, next: any) => {
        next()
      }

export default m
