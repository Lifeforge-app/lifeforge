import { getInstance, init, registerRemotes } from '@module-federation/runtime'

import type { ModuleCategory } from '@lifeforge/configs'

import { type FederatedModuleCategory } from '../providers/FederationProvider'
import {
  type CategoryOrder,
  type FederatedModule,
  fetchCategoryOrder,
  fetchModuleManifest
} from '../utils/fetchModuleData'
import { sortRoutes } from '../utils/sortRoutes'
import { registeredRemotesSet } from './loadModuleConfig'

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
  globalProviders: React.FC<{ children: React.ReactNode }>[]
  categoryTranslations: CategoryOrder
}> {
  const routes: FederatedModuleCategory[] = []
  const globalProviders: React.FC<{ children: React.ReactNode }>[] = []

  // Register core/system modules
  for (const mod of coreModules) {
    addToRoute(routes, mod.category, mod)

    // Collect provider from core module if exists
    if (mod.provider) {
      globalProviders.push(mod.provider)
    }
  }

  // Fetch federated modules and category order
  const [federatedModuleManifests, categoryOrder] = await Promise.all([
    fetchModuleManifest(apiHost),
    fetchCategoryOrder(apiHost)
  ])

  const remotes: { name: string; entry: string; type: 'module' }[] = []

  for (const mod of federatedModuleManifests) {
    if (!import.meta.env.DEV && mod.isDevMode) {
      continue
    }

    const remoteName = `m_${mod.moduleId}`
    registeredRemotesSet.add(remoteName)

    remotes.push({
      name: remoteName,
      entry: `${import.meta.env.VITE_API_HOST}${mod.remoteEntryUrl}`,
      type: 'module' as const
    })

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

    addToRoute(routes, mod.category, moduleConfig)
  }

  if (remotes.length > 0) {
    if (!getInstance()) {
      init({
        name: 'host',
        remotes
      })
    } else {
      registerRemotes(remotes)
    }
  }

  return {
    routes: sortRoutes(routes, categoryOrder),
    globalProviders,
    categoryTranslations: categoryOrder
  }
}
