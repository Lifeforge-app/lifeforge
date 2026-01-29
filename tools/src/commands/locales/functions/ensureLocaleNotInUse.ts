import logger from '@/utils/logger'
import getPBInstance from '@/utils/pocketbase'

async function ensureLocaleNotInUse(shortName: string) {
  logger.debug('Checking if locale is in use...')

  const { pb, killPB } = await getPBInstance()

  const user = await pb.collection('users').getFirstListItem("id != ''")

  killPB?.()

  if (user.language === shortName) {
    logger.error(
      `Cannot uninstall locale "${shortName}". It is currently selected by the user.`
    )

    process.exit(1)
  }
}

export default ensureLocaleNotInUse
