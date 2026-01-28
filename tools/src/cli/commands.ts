/**
 * Static command registry for bundled CLI.
 * All commands must be explicitly imported here since dynamic imports
 * don't work in bundled code.
 */
import type { Command } from 'commander'

import changelog from '@/commands/changelog'
import db from '@/commands/db'
import dev from '@/commands/dev'
import locales from '@/commands/locales'
import modules from '@/commands/modules'
import project from '@/commands/project'

type CommandSetup = (program: Command) => void

export const commands: CommandSetup[] = [
  changelog,
  db,
  dev,
  locales,
  modules,
  project
]
