import { decrypt } from '@functions/auth/encryption'
import { createServiceLogger } from '@functions/logging'
import chalk from 'chalk'

import { ModuleRegistry } from '@lifeforge/module-runtime/registry'

import { db } from '../../drizzle'

const logger = createServiceLogger('API Key Vault')

const apiKeyCache = new Map<string, { key: string; exposable: boolean }>()

export async function validateCallerAccess(
  callerModule: { source: 'app' | 'core'; id: string },
  id: string
) {
  if (callerModule.source === 'core') {
    return
  }

  const entry = ModuleRegistry.entries.find(
    candidate =>
      candidate.name === callerModule.id ||
      candidate.name.endsWith('/' + callerModule.id)
  )

  if (!entry) {
    throw new Error(`Module ${callerModule.id} is not registered`)
  }

  const access = entry.APIKeyAccess?.[id]

  if (!access) {
    throw new Error(`API access for ${id} not found`)
  }
}

async function getAPIKey(
  id: string,
  callerModule?: { source: 'app' | 'core'; id: string }
): Promise<string> {
  try {
    if (!callerModule) {
      throw new Error(
        'Unable to determine caller module for API key validation.'
      )
    }

    const cached = apiKeyCache.get(id)

    if (cached !== undefined) {
      if (!cached.exposable) {
        await validateCallerAccess(callerModule, id)
      }

      return cached.key
    }

    const record = await db.query.apiKeysEntries.findFirst({
      where: { keyId: id }
    })

    if (!record) {
      throw new Error(`API key for ${id} not found`)
    }

    if (!record.exposable) {
      await validateCallerAccess(callerModule, id)
    }

    try {
      logger.info(
        `API key for ${chalk.blue(id)} retrieved by ${chalk.blue(callerModule.source)}:${chalk.blue(callerModule.id)}`
      )

      const decrypted = decrypt(record.key, process.env.MASTER_KEY!)
      apiKeyCache.set(id, {
        key: decrypted,
        exposable: record.exposable
      })

      return decrypted
    } catch {
      throw new Error(`Failed to decrypt API key for ${id}.`)
    }
  } catch (err) {
    throw new Error(
      `Failed to retrieve API key for ${id}: ${err instanceof Error ? err.message : String(err)}`
    )
  }
}

export default function getAPIKeyFactory(callerModule?: {
  source: 'app' | 'core'
  id: string
}): (id: string) => Promise<string> {
  return (id: string) => getAPIKey(id, callerModule)
}
