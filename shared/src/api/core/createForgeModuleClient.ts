import type { ModuleConfig } from '../../interfaces/module_config.types'
import type { ProxyTree } from '../typescript/forge_proxy.types'
import createForgeProxy from './createForgeProxy'

/**
 * Wraps a module configuration and automatically appends a type-safe `forgeAPI` proxy client
 * resolved dynamically from the module's contract.
 */
export default function createForgeModuleClient<T extends ModuleConfig>(
  config: T
): T & { forgeAPI: T['contract'] extends undefined ? undefined : ProxyTree<T['contract']> } {
  return {
    ...config,
    forgeAPI: config.contract ? (createForgeProxy(config.contract) as any) : undefined
  } as any
}
