import { type Logger, createLogger } from '@lifeforge/log'

export const loaderLogger: Logger = createLogger({ name: 'Module Loader' })

export type { Logger }
