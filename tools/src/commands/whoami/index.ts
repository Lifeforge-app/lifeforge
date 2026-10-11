import chalk from 'chalk'
import type { Command } from 'commander'

import { REGISTRY_REPO, getGithubLogin } from '@/utils/github'
import logger from '@/utils/logger'

export default function setup(program: Command): void {
  program
    .command('whoami')
    .description('Show the authenticated GitHub user')
    .action(whoamiHandler)
}

async function whoamiHandler() {
  logger.debug(`Registry: ${chalk.blue(REGISTRY_REPO)}`)

  const login = getGithubLogin()

  logger.info(`Logged in as: ${chalk.blue(login)}`)
}
