import chalk from 'chalk'
import postgres from 'postgres'

import { failSpinner, startSpinner, stopSpinner } from '@/utils/spinner'

import { listLocales } from './listLocales'

async function setFirstLangInDB(shortName: string) {
  const installedLocales = listLocales()

  if (installedLocales.length === 1) {
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) return

    startSpinner(`Setting ${chalk.blue(shortName)} as default language...`)

    try {
      const sql = postgres(databaseUrl, { max: 1, timeout: 3 })
      const [user] = await sql`SELECT id FROM users LIMIT 1`

      if (user) {
        await sql`UPDATE users SET language = ${shortName} WHERE id = ${user.id}`
      }
      await sql.end()

      stopSpinner(`Set ${chalk.blue(shortName)} as default language`)
    } catch {
      failSpinner()
    }
  }
}

export default setFirstLangInDB
