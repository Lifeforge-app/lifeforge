import type { Command } from 'commander'

import { COMMANDS } from '@/commands/project/constants/commands'

import { PROJECTS } from './constants/projects'
import { createCommandHandler } from './handlers/createCommandHandler'

export default function setup(program: Command): void {
  for (const commandType of COMMANDS) {
    program
      .command(commandType)
      .description(`Run ${commandType} for specified projects`)
      .argument(
        '[projects...]',
        `Project names to run ${commandType} on. Leave blank for all projects. Available: ${Object.keys(PROJECTS).join(', ')}`
      )
      .action(createCommandHandler(commandType))
  }
}
