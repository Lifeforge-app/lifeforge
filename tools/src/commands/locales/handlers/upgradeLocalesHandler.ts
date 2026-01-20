import chalk from 'chalk'

import { bunInstall, installPackage } from '@/utils/commands'
import { confirmAction } from '@/utils/helpers'
import logger from '@/utils/logger'
import normalizePackage from '@/utils/normalizePackage'

import { checkAuth } from '../../../utils/registry'
import getPackagesToCheck from '../functions/getPackagesToCheck'
import getUpgrades from '../functions/getUpgrades'

export async function upgradeLocaleHandler(langCode?: string): Promise<void> {
  const packagesToCheck = getPackagesToCheck(langCode)

  const upgrades = await getUpgrades(packagesToCheck)

  if (!(await confirmAction('Proceed with upgrades?'))) return

  await checkAuth()

  let upgradedCount = 0

  for (const upgrade of upgrades) {
    logger.info(`Upgrading ${chalk.blue(upgrade.name)}...`)

    try {
      installPackage(
        upgrade.name,
        normalizePackage(upgrade.name, 'locale').targetDir
      )

      logger.success(`Upgraded ${chalk.blue(upgrade.name)}`)
      upgradedCount++
    } catch (error) {
      logger.error(`Failed to upgrade ${chalk.blue(upgrade.name)}: ${error}`)
    }
  }

  if (upgradedCount > 0) {
    bunInstall()
    logger.success(
      `Upgraded ${upgradedCount} locale${upgradedCount > 1 ? 's' : ''}`
    )
  }
}
