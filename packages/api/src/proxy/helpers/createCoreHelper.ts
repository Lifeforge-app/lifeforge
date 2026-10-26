import type { UntypedEndpointType } from '../../types/proxy'
import { ForgeEndpoint } from '../forgeEndpoint'
import type { ProxyScope } from '../scope'
import {
  CORE_HELPERS,
  type CoreHelperName,
  type CoreHelperTypes
} from './config'

/**
 * Factory function that creates a core helper method for a given helper name.
 *
 * @param scope - Routing metadata bound by the host
 * @param name - The name of the core helper to create
 * @internal Used by createForgeProxy to provide core helper methods
 */
export function createCoreHelper<T extends CoreHelperName>(
  scope: ProxyScope,
  name: T
) {
  const { path } = CORE_HELPERS[name]

  return (input: CoreHelperTypes[T]['input']) =>
    new ForgeEndpoint<
      UntypedEndpointType<
        CoreHelperTypes[T]['output'],
        never,
        CoreHelperTypes[T]['input']
      >
    >(scope, path).input(input)
}
