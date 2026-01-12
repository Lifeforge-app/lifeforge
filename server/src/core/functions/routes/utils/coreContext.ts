/**
 * CoreContext - Runtime utilities injected into forgeController callbacks
 *
 * This module provides the implementation of core utilities that modules
 * access via the `core` parameter in their callbacks.
 *
 * NOTE: All utilities except `log` are temporarily commented out during
 * the logging overhaul. They will be restored in a future update.
 */
// import type { Server } from 'socket.io'
// import {
//   decrypt,
//   decrypt2,
//   encrypt,
//   encrypt2
// } from '@functions/auth/encryption'
// import { PBService } from '@functions/database'
// import { getAPIKey } from '@functions/database'
// import { fetchAI as _fetchAI } from '@functions/external/ai'
// import searchLocations from '@functions/external/location'
// import getMedia from '@functions/external/media'
// import parseOCR from '@functions/external/ocr'
// import { addToTaskPool, updateTaskInPool } from '@functions/socketio/taskPool'
// import { checkModulesAvailability } from '@functions/utils/checkModulesAvailability'
// import convertPDFToImage from '@functions/utils/convertPDFToImage'
// import TempFileManager from '@functions/utils/tempFileManager'
import { type Logger, createLogger } from '@lifeforge/log'

export interface CoreContext {
  logging: Logger
  // ai: {
  //   fetch: typeof _fetchAI
  // }
  // tasks: {
  //   add: (task: { description: string; data?: any; progress?: any }) => string
  //   update: (taskId: string, updates: any) => void
  // }
  // media: {
  //   get: typeof getMedia
  //   convertPDFToImage: typeof convertPDFToImage
  // }
  // crypto: {
  //   encrypt: typeof encrypt
  //   decrypt: typeof decrypt
  //   encryptString: typeof encrypt2
  //   decryptString: typeof decrypt2
  // }
  // external: {
  //   searchLocations: (query: string) => ReturnType<typeof searchLocations>
  //   parseOCR: typeof parseOCR
  // }
  // getAPIKey: (provider: string) => Promise<string | null>
  // checkModulesAvailability: typeof checkModulesAvailability
  // tempFile: typeof TempFileManager
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
    logging: createLogger({ name: moduleId || 'unknown-module' })
    // ai: {
    //   fetch: params => _fetchAI({ ...params, pb })
    // },
    // tasks: {
    //   add: task =>
    //     addToTaskPool(io, { ...task, module: moduleId, status: 'pending' }),
    //   update: (taskId, updates) => updateTaskInPool(io, taskId, updates)
    // },
    // media: {
    //   get: getMedia,
    //   convertPDFToImage
    // },
    // crypto: {
    //   encrypt,
    //   decrypt,
    //   encryptString: encrypt2,
    //   decryptString: decrypt2
    // },
    // external: {
    //   searchLocations: async query => {
    //     const key = await getAPIKey('google_places', pb)
    //     if (!key) throw new Error('Google Places API key not found')
    //     return searchLocations(key, query)
    //   },
    //   parseOCR
    // },
    // getAPIKey: provider => getAPIKey(provider, pb),
    // checkModulesAvailability,
    // tempFile: TempFileManager
  }
}
