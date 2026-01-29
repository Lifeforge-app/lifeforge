import type { Command } from 'commander'

import { buildModuleHandler } from './handlers/buildModuleHandler'
import { compareModuleHandler } from './handlers/compareModuleHandler'
import { createModuleHandler } from './handlers/createModuleHandler'
import { installModuleHandler } from './handlers/installModuleHandler'
import { listModulesHandler } from './handlers/listModuleHandler'
import { publishModuleHandler } from './handlers/publishModuleHandler'
import { uninstallModuleHandler } from './handlers/uninstallModuleHandler'
import { upgradeModuleHandler } from './handlers/upgradeModuleHandler'
import { viewModuleHandler } from './handlers/viewModuleHandler'

export default function setup(program: Command): void {
  const command = program
    .command('modules')
    .description('Manage LifeForge modules')

  command
    .command('list')
    .alias('ls')
    .description('List all installed modules')
    .action(listModulesHandler)

  command
    .command('install')
    .alias('i')
    .alias('add')
    .description('Install modules from the LifeForge registry')
    .argument(
      '<modules...>',
      'Modules to install, e.g., @lifeforge/lifeforge--calendar'
    )
    .option('--dev', 'Keep source code and git repository for development')
    .action(installModuleHandler)

  command
    .command('uninstall')
    .alias('un')
    .alias('rm')
    .alias('remove')
    .description('Uninstall modules')
    .argument('<modules...>', 'Modules to uninstall, e.g., achievements')
    .action(uninstallModuleHandler)

  command
    .command('upgrade')
    .alias('up')
    .alias('u')
    .description('Upgrade modules to latest version from registry')
    .argument('[module]', 'Module to upgrade (optional, checks all if omitted)')
    .action(upgradeModuleHandler)

  command
    .command('build')
    .alias('b')
    .description('Build module client bundles for federation')
    .argument('[module]', 'Module to build (optional, builds all if omitted)')
    .option(
      '--docker',
      'Build for Docker (outputs to dist-docker with /api base)'
    )
    .action(buildModuleHandler)

  command
    .command('create')
    .alias('new')
    .description('Create a new LifeForge module scaffold')
    .argument(
      '[moduleName]',
      'Name of the module to create. Leave empty to prompt.'
    )
    .action(createModuleHandler)

  command
    .command('publish')
    .description('Publish a LifeFordge module to the registry')
    .argument('<module>', 'Module to publish from apps/')
    .option(
      '--official',
      'Publish as official module (requires maintainer access)'
    )
    .action(publishModuleHandler)

  command
    .command('compare')
    .description('Compare local module content with registry version')
    .argument('[module]', 'Module to compare (optional, checks all if omitted)')
    .action(compareModuleHandler)

  command
    .command('view')
    .alias('v')
    .alias('info')
    .description('View package info from the registry')
    .argument(
      '<module>',
      'Module to view, e.g., calendar or @lifeforge/lifeforge--calendar'
    )
    .action(viewModuleHandler)
}
