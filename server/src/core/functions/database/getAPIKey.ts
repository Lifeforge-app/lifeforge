import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

import { decrypt2 } from '@functions/auth/encryption'
import { LoggingService } from '@functions/logging/loggingService'

import PBService from './PBService'
import { getCallerModuleId } from '@functions/utils/getCallerModuleId'

export async function validateCallerAccess(
  callerModule: { source: 'app' | 'core'; id: string },
  id: string
) {
  if (callerModule.source === 'core') {
    return
  }

  const packageJSONPath = path.resolve(
    import.meta.dirname.split('/server')[0],
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

export default async function getAPIKey(id: string, pb: PBService) {
  try {
    const callerModule = getCallerModuleId()

    if (!callerModule) {
      throw new Error(
        'Unable to determine caller module for API key validation.'
      )
    }

    await validateCallerAccess(callerModule, id)

    const { key } = await pb.getFirstListItem
      .collection('api_keys__entries')
      .filter([
        {
          field: 'keyId',
          operator: '=',
          value: id
        }
      ])
      .execute()
      .catch(err => {
        throw new Error(err.message)
      })

    try {
      LoggingService.info(
        `API key for ${chalk.blue(id)} retrieved by ${chalk.blue(callerModule.source)}:${chalk.blue(callerModule.id)}`,
        'KEY VAULT'
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
