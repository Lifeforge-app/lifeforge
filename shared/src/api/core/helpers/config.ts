import z from 'zod'

import GetGoogleFontResponseSchema from '../../../interfaces/google_fonts.types'
import type { UntypedEndpointType } from '../../typescript/forge_proxy.types'
import type ForgeEndpoint from '../forgeEndpoint'

/**
 * Configuration map for core server helper methods.
 *
 * These helpers provide convenient access to frequently-used core server endpoints
 * (like API key checking, CORS proxy, Google Fonts) without needing the full route path.
 *
 * Available on all forgeAPI client instances regardless of the current path.
 */
const CORE_HELPERS = {
  checkAPIKeys: {
    path: 'apiKeys/entries/checkKeys',
    schema: {
      input: z.object({ keys: z.string() }),
      output: z.boolean()
    }
  },
  getAPIKeys: {
    path: 'apiKeys/entries/get',
    schema: {
      input: z.object({ keyId: z.string() }),
      output: z.string()
    }
  },
  checkModuleAvailability: {
    path: 'modules/checkModuleAvailability',
    schema: {
      input: z.object({ moduleId: z.string() }),
      output: z.boolean()
    }
  },
  corsAnywhere: {
    path: 'corsAnywhere',
    schema: {
      input: z.object({ url: z.string() }),
      output: z.string()
    }
  },
  getGoogleFont: {
    path: 'user/personalization/getGoogleFont',
    schema: {
      input: z.object({ family: z.string() }),
      output: GetGoogleFontResponseSchema
    }
  }
} as const

/** Union type of all available core helper names */
export type CoreHelperName = keyof typeof CORE_HELPERS

/**
 * Mapped type that generates the correct function signature for each core helper.
 *
 * Each helper is a function that takes the schema input and returns a ForgeEndpoint
 * configured for that specific core server route.
 *
 * @example
 * ```typescript
 * forgeAPI.checkAPIKeys({ keys: 'smtp-user,smtp-pass' }).queryOptions()
 * forgeAPI.corsAnywhere({ url: 'https://external-api.com' }).query()
 * forgeAPI.getGoogleFont({ family: 'Roboto' }).query()
 * ```
 */
export type CoreHelperReturnTypes = {
  [K in CoreHelperName]: (
    input: z.infer<(typeof CORE_HELPERS)[K]['schema']['input']>
  ) => ForgeEndpoint<
    UntypedEndpointType<
      z.infer<(typeof CORE_HELPERS)[K]['schema']['output']>,
      never,
      z.infer<(typeof CORE_HELPERS)[K]['schema']['input']>
    >
  >
}

export default CORE_HELPERS
