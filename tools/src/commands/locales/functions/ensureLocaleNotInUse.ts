import Logging from '@/utils/logging'
import getPBInstance from '@/utils/pocketbase'

async function ensureLocaleNotInUse(shortName: string) {
  Logging.debug('Checking if locale is in use...')

  const { pb, killPB } = await getPBInstance()

  try {
    const user = await pb.collection('users').getFirstListItem("id != ''")

    if (user.language === shortName) {
      Logging.actionableError(
        `Cannot uninstall locale "${shortName}"`,
        'This language is currently selected. Change your language first.'
      )

      killPB?.()

      process.exit(1)
    }
  } finally {
    killPB?.()
  }
}

export default ensureLocaleNotInUse
