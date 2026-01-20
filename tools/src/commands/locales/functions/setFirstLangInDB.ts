import chalk from 'chalk'

import logger from '@/utils/logger'
import getPBInstance from '@/utils/pocketbase'

import { listLocales } from './listLocales'

async function setFirstLangInDB(shortName: string) {
  const installedLocales = listLocales()

  if (installedLocales.length === 1) {
    logger.debug('This is the first locale, setting as default...')

    const { pb, killPB } = await getPBInstance()

    const user = await pb.collection('users').getFirstListItem("id != ''")

    await pb.collection('users').update(user.id, { language: shortName })

    logger.info(`Set ${chalk.blue(shortName)} as default language`)
    killPB?.()
  }
}

export default setFirstLangInDB
