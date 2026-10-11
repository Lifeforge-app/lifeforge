import chalk from 'chalk'

import logger from '@/utils/logger'
import { resolveEntry, type RegistryEntry } from '@/utils/registryIndex'

export interface LocaleUpgrade {
  id: string
  name: string
  current: string
  latest: string
  entry: RegistryEntry
}

async function getUpgrades(
  packagesToCheck: { name: string; version: string }[]
): Promise<LocaleUpgrade[]> {
  const upgrades: LocaleUpgrade[] = []

  for (const pkg of packagesToCheck) {
    const entry = await resolveEntry('locales', pkg.name)

    if (!entry) {
      continue
    }

    if (entry.latest && entry.latest !== pkg.version) {
      upgrades.push({
        id: pkg.name,
        name: pkg.name,
        current: pkg.version,
        latest: entry.latest,
        entry
      })
    }
  }

  if (!upgrades.length) {
    logger.info('All locales are up to date')
    process.exit(0)
  }

  logger.info('Available upgrades:')
  upgrades.forEach(upgrade =>
    logger.print(
      `  ${chalk.blue(upgrade.name)}: ${upgrade.current} → ${chalk.green(upgrade.latest)}`
    )
  )

  return upgrades
}

export default getUpgrades
