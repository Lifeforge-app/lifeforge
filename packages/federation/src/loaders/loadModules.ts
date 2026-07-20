import { getInstance, init, registerRemotes } from '@module-federation/runtime'

import type { ModuleCategory } from '@lifeforge/configs'

import { type FederatedModuleCategory } from '../providers/FederationProvider'
import {
  type CategoryOrder,
  fetchCategoryOrder,
  sortRoutes
} from '../utils/sortRoutes'
import {
  type FederatedModule,
  fetchModuleManifest,
  registeredRemotesSet
} from './loadModuleConfig'

export type GlobalProviderComponent = React.FC<{ children: React.ReactNode }>

/**
 * Adds the module configuration to the routes
 */
function addToRoute(
  routes: ModuleCategory[],
  category: string,
  moduleConfig: ModuleCategory['items'][number]
) {
  const categoryIndex = routes.findIndex(cat => cat.title === category)

  if (categoryIndex > -1) {
    const cat = routes[categoryIndex]

    if (cat) {
      cat.items.push(moduleConfig)
    }
  } else {
    routes.push({
      title: category,
      items: [moduleConfig]
    })
  }
}

/**
 * Entry point for constructing the routes
 * Loads core modules (static) and federated modules (dynamic) from the server
 * Collects providers from module manifests
 */
export default async function loadModules(
  apiHost: string,
  coreModules: ModuleCategory['items'][number][] = []
): Promise<{
  routes: FederatedModuleCategory[]
  globalProviders: GlobalProviderComponent[]
  categoryTranslations: CategoryOrder
}> {
  const ROUTES: FederatedModuleCategory[] = []

  const globalProviders: GlobalProviderComponent[] = []

  for (const mod of coreModules) {
    addToRoute(ROUTES, mod.category, mod)

    // Collect provider from core module if exists
    if (mod.provider) {
      globalProviders.push(mod.provider)
    }
  }

  // Fetch federated modules and category order (which includes translations)
  const [serverManifest, categoryOrder] = await Promise.all([
    fetchModuleManifest(apiHost),
    fetchCategoryOrder(apiHost)
  ])

  // Register all remotes at once in production/production-client mode to prevent race conditions
  if (!import.meta.env.DEV) {
    const remotes = serverManifest.map(mod => {
      const remoteName = mod.name.replace(/^@[^/]+\//, '').replace(/-+/g, '_')
      registeredRemotesSet.add(remoteName)

      return {
        name: remoteName,
        entry: `${import.meta.env.VITE_API_HOST}${mod.remoteEntryUrl}`,
        type: 'module' as const
      }
    })

    if (!getInstance()) {
      init({
        name: 'host',
        remotes
      })
    } else {
      registerRemotes(remotes)
    }
  }

  for (const mod of serverManifest) {
    const moduleConfig: ModuleCategory['items'][number] & {
      rawModule: FederatedModule
    } = {
      name: mod.name,
      moduleId: mod.moduleId,
      displayName: mod.displayName,
      version: mod.version,
      description: mod.description,
      author: mod.author,
      icon: mod.icon,
      category: mod.category,
      routes: {},
      widgets: [],
      APIKeyAccess: mod.APIKeyAccess,
      rawModule: mod
    }

    addToRoute(ROUTES, mod.category, moduleConfig)
  }

  return {
    routes: sortRoutes(ROUTES, categoryOrder),
    globalProviders,
    categoryTranslations: categoryOrder
  }
}
