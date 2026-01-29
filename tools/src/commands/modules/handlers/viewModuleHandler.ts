import chalk from 'chalk'
import _ from 'lodash'

import logger from '@/utils/logger'
import normalizePackage from '@/utils/normalizePackage'
import { getPackageMetadata } from '@/utils/registry'

/**
 * Views package information from the registry.
 *
 * @param moduleName - The module name to view (e.g., calendar or @lifeforge/lifeforge--calendar)
 */
export async function viewModuleHandler(moduleName: string): Promise<void> {
  const { fullName } = normalizePackage(moduleName)

  const data = await getPackageMetadata(fullName)

  if (!data) {
    logger.error(`Package ${chalk.blue(fullName)} not found in registry`)
    process.exit(1)
  }

  const latestVersion = data['dist-tags']?.latest

  const latest = latestVersion ? data.versions?.[latestVersion] : undefined

  const info = {
    version: latestVersion,
    versions: data.versions ? Object.keys(data.versions) : [],
    deps: latest?.dependencies,
    author:
      typeof latest?.author === 'string' ? latest.author : latest?.author?.name,
    repo:
      typeof latest?.repository === 'string'
        ? latest.repository
        : latest?.repository?.url,
    displayName: latest?.displayName,
    description: latest?.description,
    homepage: latest?.homepage,
    license: latest?.license
  }

  logger.print('')
  logger.print(
    info.displayName
      ? `${chalk.bold.blue(info.displayName)} ${chalk.dim(`(${data.name || fullName})`)}`
      : chalk.bold.blue(data.name || fullName)
  )

  logger.print(info.description)
  logger.print('')

  const fields = [
    ['version', info.version ? chalk.green(info.version) : undefined],
    ['license', info.license],
    ['author', info.author],
    ['homepage', info.homepage ? chalk.cyan(info.homepage) : undefined],
    ['repository', info.repo ? chalk.cyan(info.repo) : undefined]
  ] as const

  fields
    .filter(([_, value]) => value)
    .forEach(([label, value]) => {
      logger.print(`${chalk.dim(label.padEnd(12))} ${value}`)
    })

  if (info.deps && Object.keys(info.deps).length > 0) {
    logger.print('')
    logger.print(chalk.dim('dependencies'))

    Object.entries(info.deps).forEach(([dep, version]) => {
      logger.print(`  ${dep} ${chalk.dim(version)}`)
    })
  }

  if (info.versions.length > 1) {
    logger.print('')
    logger.print(chalk.dim(`versions (${info.versions.length})`))

    const chunkedVersions = _.chunk(info.versions, 8)

    chunkedVersions.forEach((chunk: string[]) => {
      logger.print(`  ${chunk.join(chalk.dim(' · '))}`)
    })
  }

  logger.print('')
}
