import type { Command } from 'commander'

import generateRouteRegistry from './functions/registry/generateRouteRegistry'
import generateSchemaRegistry from './functions/registry/generateSchemaRegistry'
import { compareModuleHandler } from './handlers/compareModuleHandler'
import { createModuleHandler } from './handlers/createModuleHandler'
import { installModuleHandler } from './handlers/installModuleHandler'
import { listModulesHandler } from './handlers/listModuleHandler'
import { publishModuleHandler } from './handlers/publishModuleHandler'
import { uninstallModuleHandler } from './handlers/uninstallModuleHandler'
import { upgradeModuleHandler } from './handlers/upgradeModuleHandler'

export default function setup(program: Command): void {
  const command = program
    .command('modules')
    .description('Manage LifeForge modules')

  command
    .command('list')
    .description('List all installed modules')
    .action(listModulesHandler)

  command
    .command('install')
    .alias('i')
    .description('Install modules from the LifeForge registry')
    .argument(
      '<modules...>',
      'Modules to install, e.g., @lifeforge/lifeforge--calendar'
    )
    .action(installModuleHandler)

  command
    .command('uninstall')
    .alias('un')
    .description('Uninstall modules')
    .argument('<modules...>', 'Modules to uninstall, e.g., achievements')
    .action(uninstallModuleHandler)

  command
    .command('upgrade')
    .alias('up')
    .description('Upgrade modules to latest version from registry')
    .argument('[module]', 'Module to upgrade (optional, checks all if omitted)')
    .action(upgradeModuleHandler)

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
    .description('Publish a LifeForge module to the registry')
    .argument('<module>', 'Module to publish from apps/')
    .option(
      '--official',
      'Publish as official module (requires maintainer access)'
    )
    .action(publishModuleHandler)

  command
    .command('gen-registry')
    .description('Generate routes and schema registry files for all modules')
    .action(() => {
      generateRouteRegistry()
      generateSchemaRegistry()
    })

  command
    .command('compare')
    .description('Compare local module content with registry version')
    .argument('[module]', 'Module to compare (optional, checks all if omitted)')
    .action(compareModuleHandler)
}
