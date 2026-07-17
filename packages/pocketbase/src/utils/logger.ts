import { type Logger, createLogger } from '@lifeforge/log'

export function createServiceLogger(serviceName: string): Logger {
  return createLogger({ name: serviceName })
}
