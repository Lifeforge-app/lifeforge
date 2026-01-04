import CLILoggingService from '@/utils/logging'
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
    CLILoggingService.success('All locales are up to date!')

    process.exit(0)
  }

  CLILoggingService.info('Available upgrades:')
  upgrades.forEach(u =>
    CLILoggingService.info(`  ${u.name}: ${u.current} → ${u.latest}`)
  )

  return upgrades
}

export default getUpgrades
