/**
 * CoreContext - Runtime utilities injected into forge callbacks
 *
 * This module provides the implementation of core utilities that modules
 * access via the `core` parameter in their callbacks.
 */
import {
  decrypt,
  decrypt2,
  encrypt,
  encrypt2
} from '@functions/auth/encryption'
import { createCache } from '@functions/cache'
import getAPIKeyFactory from '@functions/database/getAPIKey'
import fetchAI from '@functions/external/ai'
import searchLocations from '@functions/external/location'
import parseOCR from '@functions/external/ocr'
import convertPDFToImage from '@functions/media/convertPDFToImage'
import { checkModulesAvailability } from '@functions/modules/checkModulesAvailability'
import {
  addToTaskPool,
  globalTaskPool,
  updateTaskInPool
} from '@functions/socketio/taskPool'
import TempFileManager from '@functions/utils/tempFileManager'

import { FileStorage } from '@lifeforge/file-storage'
import { type Logger, createLogger } from '@lifeforge/log'
import { CoreContext } from '@lifeforge/server-utils'

import { storageProvider } from '../../../storage'

const loggerCache = createCache<Logger>('loggers')

function getOrCreateLogger(moduleId: string): Logger {
  if (!loggerCache.has(moduleId)) {
    loggerCache.set(moduleId, createLogger({ name: moduleId }))
  }

  return loggerCache.get(moduleId)!
}

/**
 * Creates a CoreContext instance for a specific request.
 * Automatically detects the calling module using stack trace analysis.
 */
export function createCoreContext({
  module,
  schemas
}: {
  module?: { source: 'app' | 'core'; id: string }
  schemas?: Record<string, unknown>
} = {}): CoreContext<any> {
  const logging = getOrCreateLogger(
    module ? `${module.source}:${module.id}` : 'unknown-module'
  )

  return {
    logging,
    storage: new FileStorage(
      storageProvider,
      module ?? { source: 'core', id: 'unknown' },
      schemas,
      logging
    ),
    api: {
      fetchAI,
      searchLocations,
      getAPIKey: getAPIKeyFactory(module)
    },
    tempFile: TempFileManager,
    validation: {
      checkModulesAvailability
    },
    media: {
      convertPDFToImage,
      parseOCR
    },
    tasks: {
      global: globalTaskPool,
      add: addToTaskPool,
      update: updateTaskInPool
    },
    crypto: {
      decrypt,
      decrypt2,
      encrypt,
      encrypt2
    }
  }
}
