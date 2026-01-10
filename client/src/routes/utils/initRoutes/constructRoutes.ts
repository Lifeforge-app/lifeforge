import type { ModuleCategory, ModuleConfig } from 'shared'
import {
  __federation_method_getRemote as getRemote,
  __federation_method_setRemote as setRemote,
  __federation_method_unwrapDefault as unwrapModule
  // @ts-expect-error - Virtual federation methods
} from 'virtual:__federation__'

import forgeAPI from '@/utils/forgeAPI'

import sortRoutes from './routeSorter'

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

export type GlobalProviderComponent = React.FC<{ children: React.ReactNode }>

export interface ConstructRoutesResult {
  routes: ModuleCategory[]
  globalProviders: GlobalProviderComponent[]
}

/**
 * Fetches module manifest from the server
 */
async function fetchModuleManifest(): Promise<FederatedModule[]> {
  try {
    const response = await forgeAPI.modules.manifest.queryRaw()

    return response.modules ?? []
  } catch (e) {
    console.warn('Failed to fetch module manifest:', e)

    return []
  }
}

/**
 * Dynamically imports a federated module's manifest via runtime remote registration
 */
async function loadFederatedManifest(
  remoteEntryUrl: string,
  moduleName: string
): Promise<ModuleConfig> {
  const remoteName = moduleName.replace(/-+/g, '_')

  setRemote(remoteName, {
    url: `${import.meta.env.VITE_API_HOST}${remoteEntryUrl}`,
    format: 'esm',
    from: 'vite'
  })

  const remoteModule = await getRemote(remoteName, './Manifest')

  const unwrapped = (await unwrapModule(remoteModule)) as ModuleConfig

  if (!unwrapped) {
    throw new Error(`Failed to load federated manifest: ${moduleName}`)
  }

  return unwrapped
}

/**
 * Attempts to load a GlobalProvider from a federated module
 * Returns null if the module doesn't expose a GlobalProvider
 */
async function loadFederatedGlobalProvider(
  moduleName: string
): Promise<GlobalProviderComponent | null> {
  const remoteName = moduleName.replace(/-+/g, '_')

  try {
    const remoteModule = await getRemote(remoteName, './GlobalProvider')

    const unwrapped = await unwrapModule(remoteModule)

    return (unwrapped as GlobalProviderComponent) ?? null
  } catch {
    // Module doesn't expose GlobalProvider - this is expected for most modules
    return null
  }
}

/**
 * Adds the module configuration to the routes
 */
const addToRoute = (
  routes: ModuleCategory[],
  category: string,
  moduleConfig: ModuleCategory['items'][number]
) => {
  const categoryIndex = routes.findIndex(cat => cat.title === category)

  if (categoryIndex > -1) {
    routes[categoryIndex].items.push(moduleConfig)
  } else {
    routes.push({
      title: category,
      items: [moduleConfig]
    })
  }
}

/**
 * Entry point for constructing the routes
 * Fetches federated modules from the server and dynamically imports their manifests
 * Also loads GlobalProviders from modules that expose them
 */
export default async function constructRoutes(): Promise<ConstructRoutesResult> {
  const serverManifest = await fetchModuleManifest()

  const ROUTES: ModuleCategory[] = []

  const globalProviders: GlobalProviderComponent[] = []

  for (const mod of serverManifest) {
    try {
      const moduleManifest = await loadFederatedManifest(
        mod.remoteEntryUrl,
        mod.name
      )

      const moduleConfig: ModuleCategory['items'][number] = {
        name: mod.name,
        displayName: mod.displayName,
        version: mod.version,
        description: mod.description,
        author: mod.author,
        icon: mod.icon,
        category: mod.category,
        routes: moduleManifest.routes,
        provider: moduleManifest.provider,
        subsection: moduleManifest.subsection,
        hidden: moduleManifest.hidden,
        disabled: moduleManifest.disabled,
        clearQueryOnUnmount: moduleManifest.clearQueryOnUnmount,
        APIKeyAccess: mod.APIKeyAccess
      }

      addToRoute(ROUTES, mod.category, moduleConfig)

      // Try to load GlobalProvider for this module
      const globalProvider = await loadFederatedGlobalProvider(mod.name)

      if (globalProvider) {
        globalProviders.push(globalProvider)
      }
    } catch (e) {
      console.error(`Failed to load module ${mod.name}:`, e)
    }
  }

  return {
    routes: sortRoutes(ROUTES),
    globalProviders
  }
}
