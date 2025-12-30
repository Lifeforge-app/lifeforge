import fs from 'fs'

import { PB_BINARY_PATH, PB_KWARGS } from '@/constants/db'
import {
  checkPortInUse,
  delay,
  executeCommand,
  killExistingProcess
} from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

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
      const killedProcess = killExistingProcess('./pocketbase serve')

      if (killedProcess) {
        await delay(2000)
      }

      if (checkPortInUse(8090)) {
        CLILoggingService.actionableError(
          'No Pocketbase instance found running, but port 8090 is already in use.',
          'Please free up the port. Are you using the port for another application? (e.g., port forwarding, etc.)'
        )
        process.exit(1)
      }

      if (!fs.existsSync(PB_BINARY_PATH)) {
        CLILoggingService.error(
          `PocketBase binary does not exist: ${PB_BINARY_PATH}`
        )
        process.exit(1)
      }

      return `${PB_BINARY_PATH} serve ${PB_KWARGS.join(' ')}`
    },
    cwd: () => process.env.PB_DIR!,
    requiresEnv: ['PB_DIR']
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
        CLILoggingService.actionableError(
          `Port ${PORT} is already in use.`,
          'Please free up the port or set a different PORT environment variable.'
        )
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
