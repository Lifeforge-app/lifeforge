import path from 'node:path'

import concurrently from 'concurrently'
import type { Command } from 'commander'

import { ROOT_DIR } from '@/constants/constants'
import executeCommand from '@/utils/commands'
import logger from '@/utils/logger'

/**
 * Builds (unless `--no-build`) and starts the API server and the web client in
 * production mode, concurrently.
 */
export function startHandler(this: Command): void {
  // Prevent forge CLI's --tsconfig from leaking to child processes
  delete process.env.TSX_TSCONFIG_PATH

  const build = this.opts().build as boolean

  const globalOptions = this.parent?.opts<{ host?: boolean; port?: string }>()

  const host = globalOptions?.host

  const port = globalOptions?.port

  if (build) {
    logger.info('Building LifeForge for production...')

    // Build only the core (framework packages + server + client). Installed
    // modules are already built (and cleaned) — building them would fail.
    executeCommand(
      'pnpm exec turbo build --filter=@lifeforge/server --filter=@lifeforge/client',
      { cwd: ROOT_DIR, stdio: 'inherit' }
    )
  }

  const clientArgs: string[] = []

  if (host) clientArgs.push('--host')
  if (port) clientArgs.push('--port', port)

  logger.info('Starting production services...')

  const { result } = concurrently(
    [
      {
        name: 'server',
        command: 'pnpm run start:prod',
        cwd: path.join(ROOT_DIR, 'apps/api'),
        prefixColor: 'green'
      },
      {
        name: 'client',
        command: ['pnpm run preview', ...clientArgs].join(' '),
        cwd: path.join(ROOT_DIR, 'apps/web'),
        prefixColor: 'cyan'
      }
    ],
    {
      killOthersOn: ['failure', 'success'],
      prefix: 'name',
      restartTries: 0
    }
  )

  result.catch(error => {
    logger.error('Failed to start production services')
    logger.debug(`Error details: ${error}`)
    process.exit(1)
  })
}
