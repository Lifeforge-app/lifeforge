import type { Command } from 'commander'

import { reloadHandler } from './handlers/reloadHandler'

export default function setup(program: Command): void {
  const command = program
    .command('docker')
    .description('Docker container management commands')

  command
    .command('reload')
    .description(
      'Reload all containers after module install/uninstall (regenerates migrations, rebuilds client)'
    )
    .option('--skip-client', 'Skip client rebuild')
    .option('--skip-migrations', 'Skip migration regeneration')
    .action(reloadHandler)
}
