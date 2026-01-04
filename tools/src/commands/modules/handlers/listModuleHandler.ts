import chalk from 'chalk'

import Logging from '@/utils/logging'

import listModules from '../functions/listModules'

/**
 * Handles the list modules command
 */
export async function listModulesHandler(): Promise<void> {
  const modules = listModules(true)

  const totalCount = Object.keys(modules).length

  Logging.info(
    `Found ${totalCount} installed module${totalCount > 1 ? 's' : ''}:`
  )

  Object.entries(modules).forEach(([name, info]) => {
    console.log(
      `  ${chalk.green(name)} - ${info.displayName} (${info.version})`
    )
  })
}
