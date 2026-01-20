import { ROOT_DIR } from '@constants'
import { IPBService } from '@lifeforge/server-utils'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

import { decrypt2 } from '@functions/auth/encryption'
import { createServiceLogger } from '@functions/logging'

import PBService from './PBService'

const logger = createServiceLogger('API Key Vault')

export async function validateCallerAccess(
  callerModule: { source: 'app' | 'core'; id: string },
  id: string
) {
  if (callerModule.source === 'core') {
    return
  }

  const packageJSONPath = path.resolve(
    ROOT_DIR,
    'apps',
    callerModule.id,
    'package.json'
  )

  if (!fs.existsSync(packageJSONPath)) {
    throw new Error(`Manifest for ${callerModule.id} not found`)
  }

  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf-8'))

  if (!packageJSON.lifeforge?.APIKeyAccess) {
    throw new Error(`API access for ${callerModule.id} not found`)
  }

  const access = packageJSON.lifeforge.APIKeyAccess[id]

  if (!access) {
    throw new Error(`API access for ${id} not found`)
  }
}

async function getAPIKey(
  id: string,
  pb: PBService<{ entries: any }>,
  callerModule?: { source: 'app' | 'core'; id: string }
): Promise<string> {
  try {
    if (!callerModule) {
      throw new Error(
        'Unable to determine caller module for API key validation.'
      )
    }

    await validateCallerAccess(callerModule, id)

    const { key } = await pb.instance
      .collection('api_keys__entries')
      .getFirstListItem(`keyId = "${id}"`)
      .catch(err => {
        throw new Error(`Failed to retrieve API key for ${id}: ${err.message}`)
      })

    try {
      logger.info(
        `API key for ${chalk.blue(id)} retrieved by ${chalk.blue(callerModule.source)}:${chalk.blue(callerModule.id)}`
      )

      return decrypt2(key, process.env.MASTER_KEY!)
    } catch {
      throw new Error(`Failed to decrypt API key for ${id}.`)
    }
  } catch (err) {
    throw new Error(
      `Failed to retrieve API key for ${id}: ${err instanceof Error ? err.message : String(err)}`
    )
  }
}

export default function getAPIKeyFactory(
  pb: IPBService<any>,
  callerModule?: { source: 'app' | 'core'; id: string }
): (id: string) => Promise<string> {
  return (id: string) =>
    getAPIKey(id, pb as PBService<{ entries: any }>, callerModule)
}
