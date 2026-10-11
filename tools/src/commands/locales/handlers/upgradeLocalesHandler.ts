import chalk from 'chalk'

import { confirmAction } from '@/utils/helpers'
import { installFromGithub } from '@/utils/installSource'
import logger from '@/utils/logger'
import { setLocked, verifyLocked } from '@/utils/moduleLock'
import normalizePackage from '@/utils/normalizePackage'

import getPackagesToCheck from '../functions/getPackagesToCheck'
import getUpgrades from '../functions/getUpgrades'

export async function upgradeLocaleHandler(langCode?: string): Promise<void> {
  const packagesToCheck = getPackagesToCheck(langCode)

  const upgrades = await getUpgrades(packagesToCheck)

  if (!(await confirmAction('Proceed with upgrades?'))) return

  let upgradedCount = 0

  for (const upgrade of upgrades) {
    const { shortName, targetDir } = normalizePackage(upgrade.id, 'locale')

    const commitSha = upgrade.entry.versions[upgrade.latest]

    if (!commitSha) {
      logger.warn(
        `Registry has no release commit for ${chalk.blue(shortName)}@${upgrade.latest}`
      )
      continue
    }

    verifyLocked('locales', shortName, upgrade.latest, commitSha)

    logger.info(`Upgrading ${chalk.blue(shortName)}...`)

    try {
      await installFromGithub({
        kind: 'locales',
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

      logger.success(`Upgraded ${chalk.blue(shortName)}`)
      upgradedCount++
    } catch (error) {
      logger.error(`Failed to upgrade ${chalk.blue(shortName)}`)
      logger.debug(`Error details: ${error}`)
    }
  }

  if (upgradedCount > 0) {
    logger.success(
      `Upgraded ${upgradedCount} locale${upgradedCount > 1 ? 's' : ''}`
    )
  }
}
