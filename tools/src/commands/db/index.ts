import { log } from '@clack/prompts'
import type { Command } from 'commander'

import { ROOT_DIR } from '@/constants/constants'
import executeCommand from '@/utils/commands'
import { pushSchemaFiles } from '@/utils/pushSchema'
import { collectAllSchemaFiles } from '@/utils/schema'
import { failSpinner, startSpinner, stopSpinner } from '@/utils/spinner'

async function pushHandler(): Promise<void> {
  startSpinner('Pushing schema to the database...')

  try {
    const { applied, failures } = await pushSchemaFiles(collectAllSchemaFiles())

    if (failures.length > 0) {
      failSpinner(`Failed to apply ${failures.length} statement(s):`)

      for (const failure of failures) {
        log.error(`  - ${failure}`)
      }

      process.exit(1)
    }

    stopSpinner(
      applied === 0
        ? 'Database is already in sync'
        : `Applied ${applied} statement${applied === 1 ? '' : 's'}`
    )
  } catch (error) {
    failSpinner(`Failed to push schema: ${(error as Error).message}`)

    process.exit(1)
  }
}

export default function setup(program: Command): void {
  const command = program
    .command('db')
    .description('Manage database schemas and migrations')

  command
    .command('push')
    .description('Push local Drizzle schemas to PostgreSQL database')
    .action(pushHandler)

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
