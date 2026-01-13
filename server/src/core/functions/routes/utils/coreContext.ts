/**
 * CoreContext - Runtime utilities injected into forgeController callbacks
 *
 * This module provides the implementation of core utilities that modules
 * access via the `core` parameter in their callbacks.
 */
import { type Logger, createLogger } from '@lifeforge/log'

import {
  decrypt,
  decrypt2,
  encrypt,
  encrypt2
} from '@functions/auth/encryption'
import { checkExistence, getAPIKey } from '@functions/database'
import { fetchAI } from '@functions/external/ai'
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

export interface CoreContext {
  logging: Logger
  api: {
    fetchAI: typeof fetchAI
    searchLocations: typeof searchLocations
    getAPIKey: typeof getAPIKey
  }
  tempFile: typeof TempFileManager
  validation: {
    checkRecordExistence: typeof checkExistence
    checkModulesAvailability: typeof checkModulesAvailability
  }
  media: {
    retrieveMedia: typeof retrieveMedia
    convertPDFToImage: typeof convertPDFToImage
    parseOCR: typeof parseOCR
  }
  tasks: {
    global: typeof globalTaskPool
    add: typeof addToTaskPool
    update: typeof updateTaskInPool
  }
  crypto: {
    decrypt: typeof decrypt
    decrypt2: typeof decrypt2
    encrypt: typeof encrypt
    encrypt2: typeof encrypt2
  }
}

/**
 * Creates a CoreContext instance for a specific request.
 * Automatically detects the calling module using stack trace analysis.
 */
export function createCoreContext({
  moduleId
}: {
  moduleId?: string
}): CoreContext {
  return {
    logging: createLogger({ name: moduleId || 'unknown-module' }),
    api: {
      fetchAI,
      searchLocations,
      getAPIKey
    },
    tempFile: TempFileManager,
    validation: {
      checkRecordExistence: checkExistence,
      checkModulesAvailability
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
