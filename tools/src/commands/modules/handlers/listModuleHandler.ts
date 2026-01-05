import Logging from '@/utils/logging'

import listModules from '../functions/listModules'

/**
 * Lists all installed modules with their display names and versions.
 */
export async function listModulesHandler(): Promise<void> {
  const modules = listModules(true)

  const totalCount = Object.keys(modules).length

  if (totalCount === 0) {
    Logging.print('No modules installed')
    Logging.print(
      Logging.dim('  Run "bun forge modules install <name>" to install one')
    )

    return
  }

  Logging.print(
    `${Logging.highlight(String(totalCount))} installed module${totalCount > 1 ? 's' : ''}:\n`
  )

  Object.entries(modules).forEach(([name, info]) => {
    Logging.print(
      `  ${Logging.highlight(name)} ${Logging.dim(`v${info.version}`)}`
    )
    Logging.print(`    ${Logging.dim(info.displayName)}`)
  })
}
