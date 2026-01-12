import logger from '@/utils/logger'
import getPBInstance from '@/utils/pocketbase'

async function ensureLocaleNotInUse(shortName: string) {
  logger.debug('Checking if locale is in use...')

  const { pb, killPB } = await getPBInstance()

  const user = await pb.collection('users').getFirstListItem("id != ''")

  killPB?.()

  if (user.language === shortName) {
    logger.actionableError(
      `Cannot uninstall locale "${shortName}"`,
      'This language is currently selected. Change your language first.'
    )

    process.exit(1)
  }
}

export default ensureLocaleNotInUse
