import chalk from 'chalk'

import logger from '@/utils/logger'
import { getRegistryUrl } from '@/utils/registry'

interface LocaleUpgrade {
  name: string
  current: string
  latest: string
}

async function getLatestLocaleVersion(
  packageName: string
): Promise<string | null> {
  try {
    const registryUrl = getRegistryUrl()

    const response = await fetch(`${registryUrl}/${packageName}`)

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as {
      'dist-tags'?: { latest?: string }
    }

    return data['dist-tags']?.latest || null
  } catch {
    return null
  }
}

async function getUpgrades(
  packagesToCheck: { name: string; version: string }[]
) {
  const upgrades: LocaleUpgrade[] = []

  for (const pkg of packagesToCheck) {
    const latestVersion = await getLatestLocaleVersion(pkg.name)

    if (latestVersion && latestVersion !== pkg.version) {
      upgrades.push({
        name: pkg.name,
        current: pkg.version,
        latest: latestVersion
      })
    }
  }

  if (!upgrades.length) {
    logger.info('All locales are up to date')
    process.exit(0)
  }

  logger.info('Available upgrades:')
  upgrades.forEach(u =>
    logger.print(
      `  ${chalk.blue(u.name)}: ${u.current} → ${chalk.green(u.latest)}`
    )
  )

  return upgrades
}

export default getUpgrades
