import type { Command } from 'commander'

import { createModuleHandler } from './handlers/create-module'
import { installModuleHandler } from './handlers/install-module'
import { listModulesHandler } from './handlers/list-modules'
import { loginModuleHandler } from './handlers/login-module'
import { migrateModuleHandler } from './handlers/migrate-module'
import { publishModuleHandler } from './handlers/publish-module'
import { uninstallModuleHandler } from './handlers/uninstall-module'
import { upgradeModuleHandler } from './handlers/upgrade-module'

export default function setup(program: Command): void {
  const command = program
    .command('modules')
    .description('Manage LifeForge modules')

  command
    .command('login')
    .description('Login to the module registry')
    .action(loginModuleHandler)

  command
    .command('list')
    .description('List all installed modules')
    .action(listModulesHandler)

  command
    .command('install')
    .alias('i')
    .description('Install a module from the LifeForge registry')
    .argument(
      '<module>',
      'Module to install, e.g., @lifeforge/lifeforge--calendar'
    )
    .action(installModuleHandler)

  command
    .command('uninstall')
    .alias('un')
    .description('Uninstall a module')
    .argument('<module>', 'Module to uninstall, e.g., achievements')
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
    .command('migrate')
    .description('Migrate legacy modules to the new package architecture')
    .argument(
      '[folder]',
      'Module folder name (optional, migrates all if omitted)'
    )
    .option(
      '--official',
      'Migrate as official module (requires maintainer access)'
    )
    .action(migrateModuleHandler)
}
