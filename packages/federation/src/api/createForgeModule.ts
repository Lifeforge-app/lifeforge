import {
  type ProxyScope,
  type ProxyTree,
  createForgeProxy
} from '@lifeforge/api'
import type { ModuleConfig } from '@lifeforge/configs'

/**
 * Wraps a module configuration and attaches a type-safe `forgeAPI` proxy plus
 * the routing scope that the host binds (`remoteId`) after loading the module.
 */
export default function createForgeModule<TContract>(
  config: ModuleConfig
): ModuleConfig & {
  forgeAPI: ProxyTree<TContract>
  __scope: ProxyScope
} {
  const scope: ProxyScope = {}

  return {
    ...config,
    __scope: scope,
    forgeAPI: createForgeProxy<TContract>(scope)
  }
}
