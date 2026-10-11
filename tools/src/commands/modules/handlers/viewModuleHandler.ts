import { log } from '@clack/prompts'
import chalk from 'chalk'
import _ from 'lodash'

import { run } from '@/utils/github'
import normalizePackage from '@/utils/normalizePackage'
import { resolveEntry } from '@/utils/registryIndex'
import { startSpinner, stopSpinner } from '@/utils/spinner'

/**
 * Views module information from the registry (GitHub-hosted index).
 *
 * @param moduleName - The module name to view (e.g., calendar or @lifeforge/lifeforge--calendar)
 */
export async function viewModuleHandler(moduleName: string): Promise<void> {
  const { shortName } = normalizePackage(moduleName)

  const entry = await resolveEntry('modules', shortName)

  if (!entry) {
    log.error(`Module ${chalk.blue(shortName)} was not found in the registry`)
    process.exit(1)
  }

  let pkg: Record<string, unknown> = {}

  startSpinner('Fetching package info...')

  try {
    const content = run(`gh api repos/${entry.repo}/contents/package.json --jq .content`)

    pkg = JSON.parse(Buffer.from(content, 'base64').toString('utf-8'))
  } catch {
    // Could not fetch package.json from GitHub; show index info only
  }

  stopSpinner()

  const versions = Object.keys(entry.versions)

  log.message('')
  log.message(
    pkg.displayName
      ? `${chalk.bold.blue(String(pkg.displayName))} ${chalk.dim(`(@lifeforge/${shortName})`)}`
      : chalk.bold.blue(`@lifeforge/${shortName}`)
  )

  if (typeof pkg.description === 'string') {
    log.message(pkg.description)
  }

  log.message('')

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
      log.message(`${chalk.dim(label.padEnd(14))} ${value}`)
    })

  if (versions.length > 1) {
    log.message('')
    log.message(chalk.dim(`versions (${versions.length})`))

    _.chunk(versions, 8).forEach((chunk: string[]) => {
      log.message(`  ${chunk.join(chalk.dim(' · '))}`)
    })
  }

  log.message('')
}
