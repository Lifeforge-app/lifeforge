import type { UntypedEndpointType } from '../../types/proxy'
import { ForgeEndpoint } from '../forgeEndpoint'
import {
  CORE_HELPERS,
  type CoreHelperName,
  type CoreHelperTypes
} from './config'

/**
 * Factory function that creates a core helper method for a given helper name.
 *
 * Core helpers always target the core API, even when called from a module
 * proxy, so they deliberately use an empty scope instead of the module's.
 *
 * @param name - The name of the core helper to create
 * @internal Used by createForgeProxy to provide core helper methods
 */
export function createCoreHelper<T extends CoreHelperName>(name: T) {
  const { path } = CORE_HELPERS[name]

  return (input: CoreHelperTypes[T]['input']) =>
    new ForgeEndpoint<
      UntypedEndpointType<
        CoreHelperTypes[T]['output'],
        never,
        CoreHelperTypes[T]['input']
      >
    >({}, path).input(input)
}
