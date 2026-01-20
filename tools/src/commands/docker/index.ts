import type { Command } from 'commander'

import { migrateHandler } from './handlers/migrateHandler'

export default function setup(program: Command): void {
  const command = program
    .command('docker')
    .description('Docker container management commands')

  command
    .command('migrate')
    .description(
      'Run database migrations after module install/uninstall (regenerates and applies migrations)'
    )
    .option('--skip-migrations', 'Skip migration regeneration')
    .action(migrateHandler)
}
