import type { Command } from 'commander'

import { generateMigrationsHandler } from './handlers/generateMigrationsHandler'
import { generateSchemaHandler } from './handlers/generateSchemasHandler'
import { initializeDatabaseHandler } from './handlers/initializeDatabaseHandler'

export default function setup(program: Command): void {
  const command = program
    .command('db')
    .description('Manage database schemas and migrations')

  command
    .command('init')
    .description('Initialize the PocketBase database')
    .action(initializeDatabaseHandler)

  command
    .command('pull')
    .description('Pull schema from PocketBase into local schema files')
    .argument('[module]', 'Optional module name to pull schema for')
    .action(generateSchemaHandler)

  command
    .command('push')
    .description('Push local schemas to PocketBase as migrations')
    .argument('[module]', 'Optional module name to push migrations for')
    .action(generateMigrationsHandler)
}
