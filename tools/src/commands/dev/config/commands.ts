import chalk from 'chalk'
import fs from 'fs'

import {
  PB_BINARY_PATH,
  PB_DIR,
  PB_HOST,
  PB_KWARGS,
  PB_PORT
} from '@/constants/db'
import executeCommand from '@/utils/commands'
import {
  checkAddressInUse,
  checkPortInUse,
  delay,
  killExistingProcess
} from '@/utils/helpers'
import logger from '@/utils/logger'

/**
 * Service command configurations
 */
interface ServiceConfig {
  command: string | (() => Promise<string>) | (() => string)
  cwd?: string | (() => string)
  requiresEnv?: string[]
}

export const SERVICE_COMMANDS: Record<string, ServiceConfig> = {
  db: {
    command: async () => {
      if (checkAddressInUse(PB_HOST, PB_PORT)) {
        logger.error(
          `Database address ${chalk.blue(`${PB_HOST}:${PB_PORT}`)} is already in use.`
        )
        process.exit(1)
      }

      if (!fs.existsSync(PB_BINARY_PATH)) {
        logger.error(
          `PocketBase binary does not exist: ${chalk.blue(PB_BINARY_PATH)}. Please run "pnpm forge db init" to initialize the database.`
        )
        process.exit(1)
      }

      return `${PB_BINARY_PATH} serve ${PB_KWARGS.join(' ')}`
    },
    cwd: PB_DIR
  },
  server: {
    command: async () => {
      const killedProcess = killExistingProcess('tsx.*apps/api.*src/index.ts')

      if (killedProcess) {
        await delay(2000)
      }

      const PORT = process.env.PORT || '3636'

      if (checkPortInUse(Number(PORT))) {
        logger.error(`Port ${PORT} is already in use.`)
        process.exit(1)
      }

      return 'pnpm run dev'
    },
    cwd: 'apps/api'
  },
  docs: {
    command: () => {
      killExistingProcess('vite.*docs')

      return 'pnpm run dev'
    },
    cwd: 'docs'
  },
  client: {
    command: () => {
      killExistingProcess('vite.*apps/web')

      if (!fs.existsSync('packages/ui/dist')) {
        executeCommand('pnpm forge build ui')
      }

      return 'pnpm run dev'
    },
    cwd: 'apps/web'
  },
  ui: {
    command: () => {
      killExistingProcess('storybook.*packages/ui')

      return 'pnpm run dev'
    },
    cwd: 'packages/ui'
  }
}
