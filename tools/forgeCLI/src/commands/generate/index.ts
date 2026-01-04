import type { Command } from 'commander'

import { generateModuleRegistries } from '../modules/functions/registry/generator'

export default function setup(program: Command): void {
  program
    .command('generate')
    .alias('gen')
    .description('Generate module and locale registries')
    .action(() => {
      generateModuleRegistries()
    })
}
