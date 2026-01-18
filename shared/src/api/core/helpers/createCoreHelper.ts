import type z from 'zod'

import type { UntypedEndpointType } from '../../typescript/forge_proxy.types'
import ForgeEndpoint from '../forgeEndpoint'
import CORE_HELPERS, { type CoreHelperName } from './config'

/**
 * Factory function that creates a core helper method for a given helper name.
 *
 * Returns a function that, when called with the appropriate input,
 * returns a ForgeEndpoint configured for that core server route.
 *
 * @template T - The core helper name (checkAPIKeys, corsAnywhere, getGoogleFont)
 * @param apiHost - The base URL of the API server
 * @param name - The name of the core helper to create
 * @returns A function that creates a ForgeEndpoint for the specified core route
 *
 * @internal Used by createForgeProxy to provide core helper methods
 */
export default function createCoreHelper<T extends CoreHelperName>(
  apiHost: string | undefined,
  name: T
) {
  const { path, schema: _schema } = CORE_HELPERS[name]

  return (input: z.infer<typeof _schema.input>) =>
    new ForgeEndpoint<
      UntypedEndpointType<
        z.infer<typeof _schema.output>,
        never,
        z.infer<typeof _schema.input>
      >
    >(apiHost, path).input(input as never)
}
