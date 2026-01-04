import type { Command } from 'commander'

import createChangelogHandler from './handlers/createChangelogHandler'

export default function setup(program: Command): void {
  const command = program
    .command('changelog')
    .description('Generate changelog for LifeForge releases')

  command
    .command('create')
    .description('Create a changelog file in the docs directory')
    .argument('[year]', 'Year for the changelog, e.g., 2025')
    .argument('[week]', 'Week number for the changelog, e.g., 42')
    .action(createChangelogHandler)
}
