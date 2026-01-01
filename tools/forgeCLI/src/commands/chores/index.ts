import type { Command } from 'commander'

import initRouteAndSchemaFiles from '@/utils/initRouteAndSchemaFiles'

export default function setup(program: Command): void {
  const command = program.command('chores').description('Chore commands')

  command
    .command('setup-server-schema-and-routes')
    .description('Create server schema and routes file if not exists')
    .action(() => {
      initRouteAndSchemaFiles()
    })
}
