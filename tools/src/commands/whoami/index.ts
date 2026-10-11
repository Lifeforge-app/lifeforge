import chalk from 'chalk'
import type { Command } from 'commander'

import { getGithubLogin } from '@/utils/github'
import { failSpinner, startSpinner, stopSpinner } from '@/utils/spinner'

export default function setup(program: Command): void {
  program
    .command('whoami')
    .description('Show the authenticated GitHub user')
    .action(whoamiHandler)
}

async function whoamiHandler() {
  startSpinner('Fetching GitHub user...')

  try {
    const login = getGithubLogin()

    stopSpinner(`Logged in as: ${chalk.blue(login)}`)
  } catch {
    failSpinner('Failed to fetch GitHub user')

    process.exit(1)
  }
}
