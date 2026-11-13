import type { Command } from 'commander'

import SERVICES from './constants/services'
import { startHandler } from './handlers/startHandler'

export default function setup(program: Command): void {
  program
    .command('start')
    .description(
      'Build and start the LifeForge server and client in production mode'
    )
    .argument(
      '[service]',
      `Service to start. Leave blank for starting all. Available: ${SERVICES.join(', ')}`
    )
    .argument('[extraArgs...]', 'Extra arguments to pass to the service')
    .option('--no-build', 'Start without building first')
    .allowUnknownOption()
    .action(startHandler)
}
