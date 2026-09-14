import fs from 'fs'

import executeCommand from '@/utils/commands'
import {
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
  server: {
    command: async () => {
      const killedProcess = killExistingProcess('tsx.*apps/api.*src/index.ts')

      if (killedProcess) {
        await delay(2000)
      }

      const PORT = process.env.PORT || '3636'

      if (await checkPortInUse(Number(PORT))) {
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
