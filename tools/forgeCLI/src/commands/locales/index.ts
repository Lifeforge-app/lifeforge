import type { Command } from 'commander'

import { loginModuleHandler } from '../modules/handlers/login-module'
import { installLocaleHandler } from './handlers/install-locale'
import { listLocalesHandler } from './handlers/list-locales'
import { publishLocaleHandler } from './handlers/publish-locale'
import { uninstallLocaleHandler } from './handlers/uninstall-locale'
import { upgradeLocaleHandler } from './handlers/upgrade-locale'

export default function setup(program: Command): void {
  const command = program
    .command('locales')
    .description('Manage LifeForge language packs')

  command
    .command('login')
    .description('Login to the locale registry')
    .action(loginModuleHandler)

  command
    .command('list')
    .description('List all installed language packs')
    .action(listLocalesHandler)

  command
    .command('install')
    .alias('i')
    .description('Install a language pack from the registry')
    .argument('<lang>', 'Language code, e.g., en, ms, zh-CN, zh-TW')
    .action(installLocaleHandler)

  command
    .command('uninstall')
    .alias('un')
    .description('Uninstall a language pack')
    .argument('<lang>', 'Language code to remove')
    .action(uninstallLocaleHandler)

  command
    .command('upgrade')
    .alias('up')
    .description('Upgrade language packs to latest version')
    .argument(
      '[lang]',
      'Language code to upgrade (optional, checks all if omitted)'
    )
    .action(upgradeLocaleHandler)

  command
    .command('publish')
    .description('Publish a language pack to the registry')
    .argument('<lang>', 'Language code to publish from locales/')
    .option(
      '--official',
      'Publish as official locale (requires maintainer access)'
    )
    .action(publishLocaleHandler)
}
