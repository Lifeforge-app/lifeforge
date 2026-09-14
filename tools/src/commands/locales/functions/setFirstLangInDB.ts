import chalk from 'chalk'
import postgres from 'postgres'

import logger from '@/utils/logger'

import { listLocales } from './listLocales'

async function setFirstLangInDB(shortName: string) {
  const installedLocales = listLocales()

  if (installedLocales.length === 1) {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) return

    logger.debug('This is the first locale, setting as default...')

    try {
      const sql = postgres(databaseUrl, { max: 1, timeout: 3 })
      const [user] = await sql`SELECT id FROM users LIMIT 1`
      if (user) {
        await sql`UPDATE users SET language = ${shortName} WHERE id = ${user.id}`
        logger.info(`Set ${chalk.blue(shortName)} as default language`)
      }
      await sql.end()
    } catch (err) {
      logger.debug(`Skipping setting first language in DB: ${err}`)
    }
  }
}

export default setFirstLangInDB
