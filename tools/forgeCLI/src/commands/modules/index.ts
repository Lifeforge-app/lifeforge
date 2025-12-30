import type { Command } from 'commander'

import { addModuleHandler } from './handlers/add-module'
import { createModuleHandler } from './handlers/create-module'
import { listModulesHandler } from './handlers/list-modules'
import { publishModuleHandler } from './handlers/publish-module'
import { removeModuleHandler } from './handlers/remove-module'
import { updateModuleHandler } from './handlers/update-module'

export default function setup(program: Command): void {
  const command = program
    .command('modules')
    .description('Manage LifeForge modules')

  command
    .command('list')
    .description('List all installed modules')
    .action(listModulesHandler)
  command
    .command('add')
    .description('Download and install a module')
    .argument('<module>', 'Module to add, e.g., lifeforge-app/wallet')
    .action(addModuleHandler)
  command
    .command('update')
    .description('Update an installed module')
    .argument(
      '[module]',
      'Module to update, e.g., wallet (optional, will update all if not provided)'
    )
    .action(updateModuleHandler)
  command
    .command('remove')
    .description('Remove an installed module')
    .argument(
      '[module]',
      'Module to remove, e.g., wallet (optional, will show list if not provided)'
    )
    .action(removeModuleHandler)
  command
    .command('create')
    .description('Create a new LifeForge module scaffold')
    .argument(
      '[moduleName]',
      'Name of the module to create. Leave empty to prompt.'
    )
    .action(createModuleHandler)
  command
    .command('publish')
    .description('Publish a LifeForge module to your GitHub account')
    .argument('<module>', 'Unpublished installed module to publish')
    .action(publishModuleHandler)
}
