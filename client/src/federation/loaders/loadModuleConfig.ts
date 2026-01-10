import type { ModuleCategory, ModuleConfig } from 'shared'
import {
  __federation_method_getRemote as getRemote,
  __federation_method_setRemote as setRemote,
  __federation_method_unwrapDefault as unwrapModule
  // @ts-expect-error - Virtual federation methods
} from 'virtual:__federation__'

import forgeAPI from '@/forgeAPI'

interface FederatedModule {
  name: string
  displayName: string
  version: string
  description: string
  author: string
  icon: string
  category: string
  remoteEntryUrl: string
  isInternal: boolean
  APIKeyAccess?: Record<string, { usage: string; required: boolean }>
}

/**
 * Fetches module manifest from the server
 */
export async function fetchModuleManifest(): Promise<FederatedModule[]> {
  try {
    const { modules } = await forgeAPI.modules.manifest.query()

    return modules ?? []
  } catch (e) {
    console.warn('Failed to fetch module manifest:', e)

    return []
  }
}

/**
 * Dynamically imports a federated module's manifest via runtime remote registration
 */
export async function loadModuleConfig(
  mod: FederatedModule
): Promise<ModuleCategory['items'][number]> {
  const remoteName = mod.name.replace(/-+/g, '_')

  setRemote(remoteName, {
    url: `${import.meta.env.VITE_API_HOST}${mod.remoteEntryUrl}`,
    format: 'esm',
    from: 'vite'
  })

  const remoteModule = await getRemote(remoteName, './Manifest')

  const unwrapped = (await unwrapModule(remoteModule)) as ModuleConfig

  if (!unwrapped) {
    throw new Error(`Failed to load federated manifest: ${mod.name}`)
  }

  const moduleConfig: ModuleCategory['items'][number] = {
    name: mod.name,
    displayName: mod.displayName,
    version: mod.version,
    description: mod.description,
    author: mod.author,
    icon: mod.icon,
    category: mod.category,
    routes: unwrapped.routes,
    provider: unwrapped.provider,
    subsection: unwrapped.subsection,
    hidden: unwrapped.hidden,
    disabled: unwrapped.disabled,
    clearQueryOnUnmount: unwrapped.clearQueryOnUnmount,
    APIKeyAccess: mod.APIKeyAccess,
    widgets: unwrapped.widgets
  }

  return moduleConfig
}
