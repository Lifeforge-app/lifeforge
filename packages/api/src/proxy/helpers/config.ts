import type { GetGoogleFontResponse } from '../../types/fonts'
import type { UntypedEndpointType } from '../../types/proxy'
import type { ForgeEndpoint } from '../forgeEndpoint'

/**
 * Configuration map for core server helper methods.
 *
 * These helpers provide convenient access to frequently-used core server endpoints
 * (like API key checking, CORS proxy, Google Fonts) without needing the full route path.
 *
 * Available on all forgeAPI client instances regardless of the current path.
 */
export const CORE_HELPERS = {
  checkAPIKeys: {
    path: 'apiKeys/entries/checkKeys'
  },
  getAPIKeys: {
    path: 'apiKeys/entries/get'
  },
  checkModuleAvailability: {
    path: 'modules/checkModuleAvailability'
  },
  corsAnywhere: {
    path: 'corsAnywhere'
  },
  getGoogleFont: {
    path: 'fonts/google/get'
  }
} as const

/** Union type of all available core helper names */
export type CoreHelperName = keyof typeof CORE_HELPERS

export type CoreHelperReturnTypes = {
  [K in CoreHelperName]: (
    input: CoreHelperTypes[K]['input']
  ) => ForgeEndpoint<
    UntypedEndpointType<
      CoreHelperTypes[K]['output'],
      never,
      CoreHelperTypes[K]['input']
    >
  >
}

export interface CoreHelperTypes {
  checkAPIKeys: {
    input: { keys: string }
    output: boolean
  }
  getAPIKeys: {
    input: { keyId: string }
    output: string
  }
  checkModuleAvailability: {
    input: { id: string }
    output: boolean
  }
  corsAnywhere: {
    input: { url: string }
    output: string
  }
  getGoogleFont: {
    input: { family: string }
    output: GetGoogleFontResponse
  }
}
