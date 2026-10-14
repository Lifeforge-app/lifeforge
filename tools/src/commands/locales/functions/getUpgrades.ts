import { log } from '@clack/prompts'
import chalk from 'chalk'

import { type RegistryEntry, resolveEntry } from '@/utils/registryIndex'

import type { LocaleInfo } from './listLocales'

export interface LocaleUpgrade {
  id: string
  name: string
  current: string
  latest: string
  entry: RegistryEntry
}

async function getUpgrades(
  packagesToCheck: LocaleInfo[]
): Promise<LocaleUpgrade[]> {
  const upgrades: LocaleUpgrade[] = []

  for (const pkg of packagesToCheck) {
    const entry = await resolveEntry('locales', pkg.id)

    if (!entry) {
      continue
    }

    if (entry.latest && entry.latest !== pkg.version) {
      upgrades.push({
        id: pkg.id,
        name: pkg.name,
        current: pkg.version,
        latest: entry.latest,
        entry
      })
    }
  }

  if (!upgrades.length) {
    log.step('All locales are up to date')
    process.exit(0)
  }

  log.step('Available upgrades:')
  upgrades.forEach(upgrade =>
    log.message(
      `  ${chalk.blue(upgrade.name)}: ${upgrade.current} → ${chalk.green(upgrade.latest)}`
    )
  )

  return upgrades
}

export default getUpgrades
