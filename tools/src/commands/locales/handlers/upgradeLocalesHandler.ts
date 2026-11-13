import { log } from '@clack/prompts'
import chalk from 'chalk'

import { confirmAction } from '@/utils/helpers'
import { installFromGithub } from '@/utils/installSource'
import { setLocked, verifyLocked } from '@/utils/moduleLock'
import { failSpinner, startSpinner, stopSpinner } from '@/utils/spinner'

import getPackagesToCheck from '../functions/getPackagesToCheck'
import getUpgrades from '../functions/getUpgrades'
import { resolveLocale } from '../functions/listLocales'

export async function upgradeLocaleHandler(langCode?: string): Promise<void> {
  const packagesToCheck = getPackagesToCheck(langCode)

  const upgrades = await getUpgrades(packagesToCheck)

  if (!(await confirmAction('Proceed with upgrades?'))) return

  let upgradedCount = 0

  for (const upgrade of upgrades) {
    const mod = resolveLocale(upgrade.id)

    if (!mod) {
      log.warn(`Locale ${chalk.blue(upgrade.id)} is not installed`)

      continue
    }

    const { id: shortName, dir: targetDir } = mod

    const commitSha = upgrade.entry.versions[upgrade.latest]

    if (!commitSha) {
      log.warn(
        `Registry has no release commit for ${chalk.blue(shortName)}@${upgrade.latest}`
      )
      continue
    }

    verifyLocked('locales', shortName, upgrade.latest, commitSha)

    startSpinner(`Upgrading ${chalk.blue(shortName)}...`)

    try {
      await installFromGithub({
        id: shortName,
        entry: upgrade.entry,
        targetDir,
        version: upgrade.latest
      })

      setLocked('locales', shortName, {
        repo: upgrade.entry.repo,
        version: upgrade.latest,
        commitSha
      })

      stopSpinner(`Upgraded ${chalk.blue(shortName)}`)
      upgradedCount++
    } catch {
      failSpinner(`Failed to upgrade ${chalk.blue(shortName)}`)
    }
  }

  if (upgradedCount > 0) {
    log.success(
      `Upgraded ${upgradedCount} locale${upgradedCount > 1 ? 's' : ''}`
    )
  }
}
