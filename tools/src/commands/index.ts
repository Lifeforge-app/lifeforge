import type { Command } from 'commander'

import changelog from './changelog'
import db from './db'
import dev from './dev'
import help from './help'
import locales from './locales'
import modules from './modules'
import project from './project'
import start from './start'
import whoami from './whoami'

const COMMANDS: ((program: Command) => void)[] = [
  help,
  changelog,
  db,
  dev,
  locales,
  modules,
  project,
  start,
  whoami
]

export default COMMANDS
