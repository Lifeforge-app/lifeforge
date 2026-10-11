import type { Command } from 'commander'

import { startHandler } from './handlers/startHandler'

export default function setup(program: Command): void {
  program
    .command('start')
    .description(
      'Build and start the LifeForge server and client in production mode'
    )
    .option('--no-build', 'Start without building first')
    .action(startHandler)
}
