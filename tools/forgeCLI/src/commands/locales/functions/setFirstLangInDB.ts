import CLILoggingService from '@/utils/logging'
import getPBInstance from '@/utils/pocketbase'

import { getInstalledLocales } from './getInstalledLocales'

async function setFirstLangInDB(shortName: string) {
  const installedLocales = getInstalledLocales()

  if (installedLocales.length === 1) {
    CLILoggingService.step('First language pack - setting as default for user')

    const { pb, killPB } = await getPBInstance()

    const user = await pb.collection('users').getFirstListItem("id != ''")

    await pb.collection('users').update(user.id, { language: shortName })

    CLILoggingService.info(`Set ${shortName} as default language`)
    killPB?.()
  }
}

export default setFirstLangInDB
