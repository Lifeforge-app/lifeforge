import { program } from 'commander'

import { addLocaleHandler } from './handlers/addLocaleHandler'
import { listLocalesHandler } from './handlers/listLocalesHandler'
import { removeLocaleHandler } from './handlers/removeLocaleHandler'

export default function setup(): void {
  const command = program
    .command('locales')
    .description('Manage LifeForge language packs')

  command
    .command('list')
    .description('List all installed language packs')
    .action(listLocalesHandler)

  command
    .command('add')
    .description('Download and install a language pack')
    .argument('<lang>', 'Language code, e.g., en, ms, zh-CN, zh-TW')
    .action(addLocaleHandler)

  command
    .command('remove')
    .description('Remove an installed language pack')
    .argument('<lang>', 'Language code to remove')
    .action(removeLocaleHandler)
}
