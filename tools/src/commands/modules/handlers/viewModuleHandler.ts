import chalk from 'chalk'
import _ from 'lodash'

import { run } from '@/utils/github'
import logger from '@/utils/logger'
import normalizePackage from '@/utils/normalizePackage'
import { resolveEntry } from '@/utils/registryIndex'

/**
 * Views module information from the registry (GitHub-hosted index).
 *
 * @param moduleName - The module name to view (e.g., calendar or @lifeforge/lifeforge--calendar)
 */
export async function viewModuleHandler(moduleName: string): Promise<void> {
  const { shortName } = normalizePackage(moduleName)

  const entry = await resolveEntry('modules', shortName)

  if (!entry) {
    logger.error(`Module ${chalk.blue(shortName)} was not found in the registry`)
    process.exit(1)
  }

  let pkg: Record<string, unknown> = {}

  try {
    const content = run(`gh api repos/${entry.repo}/contents/package.json --jq .content`)

    pkg = JSON.parse(Buffer.from(content, 'base64').toString('utf-8'))
  } catch {
    logger.debug('Could not fetch package.json from GitHub; showing index info')
  }

  const versions = Object.keys(entry.versions)

  logger.print('')
  logger.print(
    pkg.displayName
      ? `${chalk.bold.blue(String(pkg.displayName))} ${chalk.dim(`(@lifeforge/${shortName})`)}`
      : chalk.bold.blue(`@lifeforge/${shortName}`)
  )

  if (typeof pkg.description === 'string') {
    logger.print(pkg.description)
  }

  logger.print('')

  const fields = [
    ['version', chalk.green(entry.latest)],
    ['repository', chalk.cyan(entry.repo)],
    ['latest commit', chalk.dim(entry.versions[entry.latest] ?? '')],
    typeof pkg.author === 'string' ? ['author', pkg.author] : undefined,
    typeof pkg.homepage === 'string'
      ? ['homepage', chalk.cyan(pkg.homepage)]
      : undefined
  ].filter(Boolean) as [string, string][]

  fields
    .filter(([, value]) => value)
    .forEach(([label, value]) => {
      logger.print(`${chalk.dim(label.padEnd(14))} ${value}`)
    })

  if (versions.length > 1) {
    logger.print('')
    logger.print(chalk.dim(`versions (${versions.length})`))

    _.chunk(versions, 8).forEach((chunk: string[]) => {
      logger.print(`  ${chunk.join(chalk.dim(' · '))}`)
    })
  }

  logger.print('')
}
