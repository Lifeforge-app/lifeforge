/**
 * CoreContext - Runtime utilities injected into forge callbacks
 *
 * This module provides the implementation of core utilities that modules
 * access via the `core` parameter in their callbacks.
 */
import { type Logger, createLogger } from '@lifeforge/log'
import { CoreContext, IPBService } from '@lifeforge/server-utils'

import {
  decrypt,
  decrypt2,
  encrypt,
  encrypt2
} from '@functions/auth/encryption'
import validateOTP from '@functions/auth/validateOTP'
import { checkExistence, getAPIKey } from '@functions/database'
import fetchAI from '@functions/external/ai'
import searchLocations from '@functions/external/location'
import parseOCR from '@functions/external/ocr'
import convertPDFToImage from '@functions/media/convertPDFToImage'
import retrieveMedia from '@functions/media/retrieveMedia'
import {
  addToTaskPool,
  globalTaskPool,
  updateTaskInPool
} from '@functions/socketio/taskPool'
import { checkModulesAvailability } from '@functions/utils/checkModulesAvailability'
import TempFileManager from '@functions/utils/tempFileManager'

// Cache loggers per module to avoid creating new file stream listeners per request
const loggerCache = new Map<string, Logger>()

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
  pb,
  module
}: {
  pb: IPBService<any>
  module?: { source: 'app' | 'core'; id: string }
}): CoreContext {
  return {
    logging: getOrCreateLogger(
      module ? `${module.source}:${module.id}` : 'unknown-module'
    ),
    api: {
      fetchAI,
      searchLocations,
      getAPIKey: getAPIKey(pb, module)
    },
    tempFile: TempFileManager,
    validation: {
      checkRecordExistence: checkExistence,
      checkModulesAvailability,
      validateOTP
    },
    media: {
      retrieveMedia,
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
