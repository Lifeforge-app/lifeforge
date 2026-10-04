import postgres from 'postgres'
import logger from '@/utils/logger'

async function ensureLocaleNotInUse(shortName: string) {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) return

  logger.debug('Checking if locale is in use...')

  try {
    const sql = postgres(databaseUrl, { max: 1, timeout: 3 })
    const [user] = await sql`SELECT language FROM users LIMIT 1`
    await sql.end()

    if (user?.language === shortName) {
      logger.error(
        `Cannot uninstall locale "${shortName}". It is currently selected by the user.`
      )
      process.exit(1)
    }
  } catch (err) {
    logger.debug(`Skipping locale in-use check: ${err}`)
  }
}

export default ensureLocaleNotInUse
