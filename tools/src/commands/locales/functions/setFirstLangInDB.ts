import Logging from '@/utils/logging'
import getPBInstance from '@/utils/pocketbase'

import { getInstalledLocales } from './getInstalledLocales'

async function setFirstLangInDB(shortName: string) {
  const installedLocales = getInstalledLocales()

  if (installedLocales.length === 1) {
    Logging.debug('This is the first locale, setting as default...')

    const { pb, killPB } = await getPBInstance()

    const user = await pb.collection('users').getFirstListItem("id != ''")

    await pb.collection('users').update(user.id, { language: shortName })

    Logging.info(`Set ${Logging.highlight(shortName)} as default language`)
    killPB?.()
  }
}

export default setFirstLangInDB
