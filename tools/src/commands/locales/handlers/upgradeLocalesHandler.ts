import { bunInstall, installPackage } from '@/utils/commands'
import { confirmAction } from '@/utils/helpers'
import Logging from '@/utils/logging'
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
    Logging.info(`Upgrading ${Logging.highlight(upgrade.name)}...`)

    try {
      installPackage(
        upgrade.name,
        normalizePackage(upgrade.name, 'locale').targetDir
      )

      Logging.success(`Upgraded ${Logging.highlight(upgrade.name)}`)
      upgradedCount++
    } catch (error) {
      Logging.error(
        `Failed to upgrade ${Logging.highlight(upgrade.name)}: ${error}`
      )
    }
  }

  if (upgradedCount > 0) {
    bunInstall()
    Logging.success(
      `Upgraded ${upgradedCount} locale${upgradedCount > 1 ? 's' : ''}`
    )
  }
}
