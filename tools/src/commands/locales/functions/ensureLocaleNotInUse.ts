import { log } from '@clack/prompts'
import postgres from 'postgres'

async function ensureLocaleNotInUse(shortName: string) {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) return

  try {
    const sql = postgres(databaseUrl, { max: 1, timeout: 3 })
    const [user] = await sql`SELECT language FROM users LIMIT 1`
    await sql.end()

    if (user?.language === shortName) {
      log.error(
        `Cannot uninstall locale "${shortName}". It is currently selected by the user.`
      )
      process.exit(1)
    }
  } catch {
    // Best-effort check: ignore DB errors
  }
}

export default ensureLocaleNotInUse
