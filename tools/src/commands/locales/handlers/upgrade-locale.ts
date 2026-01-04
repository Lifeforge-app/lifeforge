import { confirmAction, executeCommand } from '@/utils/helpers'
import Logging from '@/utils/logging'

import { checkAuth } from '../../../utils/registry'
import getLocalesMeta from '../functions/getLocalesMeta'
import getPackagesToCheck from '../functions/getPackagesToCheck'
import getUpgrades from '../functions/getUpgrades'
import installAndMoveLocales from '../functions/installAndMoveLocales'

export async function upgradeLocaleHandler(langCode?: string): Promise<void> {
  const packagesToCheck = getPackagesToCheck(langCode)

  const upgrades = await getUpgrades(packagesToCheck)

  if (!(await confirmAction('Proceed with upgrades?'))) return

  await checkAuth()

  let upgradedCount = 0

  for (const upgrade of upgrades) {
    try {
      installAndMoveLocales(
        upgrade.name,
        getLocalesMeta(upgrade.name).targetDir
      )

      Logging.success(`Upgraded ${upgrade.name} to ${upgrade.latest}`)
      upgradedCount++
    } catch (error) {
      Logging.error(`Failed to upgrade ${upgrade.name}: ${error}`)
    }
  }

  if (upgradedCount > 0) {
    executeCommand('bun install', { cwd: process.cwd(), stdio: 'inherit' })
    Logging.success(`Upgraded ${upgradedCount} locale(s)`)
  }
}
