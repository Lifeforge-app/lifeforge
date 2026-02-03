import fs from 'fs'

import { PB_BINARY_PATH, PB_DIR, PB_KWARGS, PB_HOST, PB_PORT } from '@/constants/db'
import executeCommand from '@/utils/commands'
import { checkAddressInUse, checkPortInUse, delay, killExistingProcess } from '@/utils/helpers'
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
					`Database address ${PB_HOST}:${PB_PORT} is already in use.`
				)
				process.exit(1)
			}

      if (!fs.existsSync(PB_BINARY_PATH)) {
        logger.error(
          `PocketBase binary does not exist: ${PB_BINARY_PATH}. Please run "bun forge db init" to initialize the database.`
        )
        process.exit(1)
      }

      return `${PB_BINARY_PATH} serve ${PB_KWARGS.join(' ')}`
    },
    cwd: PB_DIR
  },
  server: {
    command: async () => {
      const killedProcess = killExistingProcess(
        'lifeforge/server/node_modules/.bin/tsx'
      )

      if (killedProcess) {
        await delay(2000)
      }

      const PORT = process.env.PORT || '3636'

      if (checkPortInUse(Number(PORT))) {
        logger.error(`Port ${PORT} is already in use.`)
        process.exit(1)
      }

      return 'bun run dev'
    },
    cwd: 'server'
  },
  docs: {
    command: () => {
      killExistingProcess('lifeforge/docs/node_modules/.bin/vite')

      return 'bun run dev'
    },
    cwd: 'docs'
  },
  client: {
    command: () => {
      killExistingProcess('lifeforge/client/node_modules/.bin/vite')

      if (!fs.existsSync('shared/dist')) {
        executeCommand('bun forge build shared')
      }

      if (!fs.existsSync('packages/lifeforge-ui/dist')) {
        executeCommand('bun forge build ui')
      }

      return 'cd client && bun run dev'
    }
  },
  ui: {
    command: () => {
      killExistingProcess(
        'lifeforge/packages/lifeforge-ui/node_modules/.bin/storybook'
      )

      return 'bun run dev'
    },
    cwd: 'packages/lifeforge-ui'
  }
}
