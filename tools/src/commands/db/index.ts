import type { Command } from 'commander'

import executeCommand from '@/utils/commands'
import { ROOT_DIR } from '@/utils/constants'

import { pushSchemaHandler } from './handlers/pushSchemaHandler'

export default function setup(program: Command): void {
  const command = program
    .command('db')
    .description('Manage database schemas and migrations')

  command
    .command('push')
    .description('Push local Drizzle schemas to PostgreSQL database')
    .action(pushSchemaHandler)

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
