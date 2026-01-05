import type { Command } from 'commander'

import SERVICES from './constants/services'
import { devHandler } from './handlers/devHandler'

export default function setup(program: Command): void {
  program
    .command('dev')
    .description('Start LifeForge services for development')
    .argument(
      '[service]',
      `Service to start. Leave blank for starting db, server, and client. Available: ${SERVICES.join(', ')}`
    )
    .argument('[extraArgs...]', 'Extra arguments to pass to the service')
    .allowUnknownOption()
    .action(devHandler)
}
