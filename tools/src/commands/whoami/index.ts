import chalk from 'chalk'
import type { Command } from 'commander'

import logger from '@/utils/logger'
import { checkAuth, getRegistryUrl } from '@/utils/registry'

export default function setup(program: Command): void {
  program
    .command('whoami')
    .description('Show the currently authenticated user on the registry')
    .action(whoamiHandler)
}

async function whoamiHandler() {
  const registry = getRegistryUrl()

  logger.debug(`Registry: ${chalk.blue(registry)}`)

  const { username } = await checkAuth()

  logger.info(`Logged in as: ${chalk.blue(username)}`)
}
