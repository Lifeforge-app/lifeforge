import type { Command } from 'commander'

import { installLocaleHandler } from './handlers/installLocaleHandler'
import { listLocalesHandler } from './handlers/listLocalesHandler'
import { publishLocaleHandler } from './handlers/publishLocaleHandler'
import { uninstallLocaleHandler } from './handlers/uninstallLocaleHandler'
import { upgradeLocaleHandler } from './handlers/upgradeLocalesHandler'
import { validateLocaleStructureHandler } from './handlers/validateLocaleStructure'

export default function setup(program: Command): void {
  const command = program
    .command('locales')
    .description('Manage LifeForge language packs')

  command
    .command('list')
    .alias('ls')
    .description('List all installed language packs')
    .action(listLocalesHandler)

  command
    .command('install')
    .alias('i')
    .alias('add')
    .description('Install a language pack from the registry')
    .argument('<lang>', 'Language code, e.g., en, ms, zh-CN, zh-TW')
    .action(installLocaleHandler)

  command
    .command('uninstall')
    .alias('un')
    .alias('rm')
    .alias('remove')
    .description('Uninstall a language pack')
    .argument('<lang>', 'Language code to remove')
    .action(uninstallLocaleHandler)

  command
    .command('upgrade')
    .alias('up')
    .alias('u')
    .description('Upgrade language packs to latest version')
    .argument(
      '[lang]',
      'Language code to upgrade (optional, checks all if omitted)'
    )
    .action(upgradeLocaleHandler)

  command
    .command('validate')
    .description('Validate a language pack')
    .argument('<lang>', 'Language code to validate')
    .action(validateLocaleStructureHandler)

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
