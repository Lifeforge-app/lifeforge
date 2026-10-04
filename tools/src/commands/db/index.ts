import type { Command } from 'commander'

import { ROOT_DIR } from '@/constants/constants'
import executeCommand from '@/utils/commands'

export default function setup(program: Command): void {
  const command = program
    .command('db')
    .description('Manage database schemas and migrations')

  command
    .command('push')
    .description('Push local Drizzle schemas to PostgreSQL database')
    .action(() => {
      executeCommand('pnpm --filter @lifeforge/server db:push', {
        cwd: ROOT_DIR,
        stdio: 'inherit'
      })
    })

  command
    .command('generate')
    .description('Generate SQL migrations from Drizzle schemas')
    .action(() => {
      executeCommand('pnpm --filter @lifeforge/server db:generate', {
        cwd: ROOT_DIR,
        stdio: 'inherit'
      })
    })

  command
    .command('migrate')
    .description('Apply generated SQL migrations')
    .action(() => {
      executeCommand('pnpm --filter @lifeforge/server db:migrate', {
        cwd: ROOT_DIR,
        stdio: 'inherit'
      })
    })
}
