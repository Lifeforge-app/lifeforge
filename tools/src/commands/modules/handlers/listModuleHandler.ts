import { log } from '@clack/prompts'
import chalk from 'chalk'

import listModules from '../functions/listModules'

/**
 * Lists all installed modules with their display names and versions.
 */
export async function listModulesHandler(): Promise<void> {
  const modules = listModules(true)

  const totalCount = Object.keys(modules).length

  if (totalCount === 0) {
    log.message('No modules installed')
    log.message(
      chalk.dim('  Run "pnpm forge modules install <name>" to install one')
    )

    return
  }

  log.message(
    `${chalk.blue(String(totalCount))} installed module${totalCount > 1 ? 's' : ''}:\n`
  )

  for (const [name, info] of Object.entries(modules)) {
    log.message(
      `  ${chalk.blue(name)} ${chalk.dim(`v${info.version}`)} - ${info.displayName}`
    )
  }
}
