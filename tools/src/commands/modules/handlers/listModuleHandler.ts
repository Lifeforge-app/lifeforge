import chalk from 'chalk'

import logger from '@/utils/logger'

import listModules from '../functions/listModules'

/**
 * Lists all installed modules with their display names and versions.
 */
export async function listModulesHandler(): Promise<void> {
  const modules = listModules(true)

  const totalCount = Object.keys(modules).length

  if (totalCount === 0) {
    logger.print('No modules installed')
    logger.print(
      chalk.dim('  Run "bun forge modules install <name>" to install one')
    )

    return
  }

  logger.print(
    `${chalk.blue(String(totalCount))} installed module${totalCount > 1 ? 's' : ''}:\n`
  )

  Object.entries(modules).forEach(([name, info]) => {
    logger.print(`  ${chalk.blue(name)} ${chalk.dim(`v${info.version}`)}`)
    logger.print(`    ${chalk.dim(info.displayName)}`)
  })
}
