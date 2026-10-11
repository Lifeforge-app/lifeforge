import { createLogger, type Logger } from '@lifeforge/log'

export const loaderLogger: Logger = createLogger({ name: 'Module Loader' })

export type { Logger }
