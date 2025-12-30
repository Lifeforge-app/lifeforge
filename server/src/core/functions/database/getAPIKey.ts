import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

import { decrypt2 } from '@functions/auth/encryption'
import { LoggingService } from '@functions/logging/loggingService'

import PBService from './PBService'

export function getCallerModuleId():
  | { source: 'app' | 'core'; id: string }
  | undefined {
  const obj: { stack?: string } = {}

  Error.captureStackTrace(obj)

  const lines = obj.stack?.split('\n') || []

  const callerLine = lines[3]

  const pathMatch =
    callerLine?.match(/\((.+):\d+:\d+\)/) ||
    callerLine?.match(/at (.+):\d+:\d+/)

  const filePath = pathMatch?.[1]

  if (!filePath) return undefined

  // Try external app module: /apps/{moduleId}/server/
  const appMatch = filePath.match(/lifeforge\/apps\/([^/]+)\/server\//)

  if (appMatch)
    return {
      source: 'app',
      id: appMatch[1]
    }

  // Try core module:
  // - /lifeforge/server/src/lib/{coreModuleId}/
  // - /lifeforge/server/src/core/{coreModuleId}/
  const coreMatch = filePath.match(
    /lifeforge\/server\/src\/(?:lib|core)\/([^/]+)\//
  )

  if (coreMatch)
    return {
      source: 'core',
      id: coreMatch[1]
    }

  return undefined
}

export async function validateCallerAccess(
  callerModule: { source: 'app' | 'core'; id: string },
  id: string
) {
  if (callerModule.source === 'core') {
    return
  }

  const manifestPath = path.resolve(
    import.meta.dirname.split('/server')[0],
    'apps',
    callerModule.id,
    'manifest.ts'
  )

  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest for ${callerModule.id} not found`)
  }

  const module = await import(manifestPath)

  if (!module.default.APIKeyAccess) {
    throw new Error(`API access for ${callerModule.id} not found`)
  }

  const access = module.default.APIKeyAccess[id]

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
