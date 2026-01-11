import type { ModuleCategory } from 'shared'

import {
  type CategoryOrder,
  fetchCategoryOrder,
  sortRoutes
} from '../utils/sortRoutes'
import loadCoreModules from './loadCoreModules'
import { fetchModuleManifest, loadModuleConfig } from './loadModuleConfig'

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
 * Loads core modules (static) and federated modules (dynamic) from the server
 * Collects providers from module manifests
 */
export default async function loadModules(): Promise<{
  routes: ModuleCategory[]
  globalProviders: GlobalProviderComponent[]
  categoryTranslations: CategoryOrder
}> {
  const ROUTES: ModuleCategory[] = []

  const globalProviders: GlobalProviderComponent[] = []

  // Load core modules (static imports)
  const coreModules = loadCoreModules()

  for (const mod of coreModules) {
    addToRoute(ROUTES, mod.category, mod)

    // Collect provider from core module if exists
    if (mod.provider) {
      globalProviders.push(mod.provider as unknown as GlobalProviderComponent)
    }
  }

  // Fetch federated modules and category order (which includes translations)
  const [serverManifest, categoryOrder] = await Promise.all([
    fetchModuleManifest(),
    fetchCategoryOrder()
  ])

  for (const mod of serverManifest) {
    try {
      const moduleConfig = await loadModuleConfig(mod)

      addToRoute(ROUTES, mod.category, moduleConfig)

      // Collect provider from manifest if exists
      if (moduleConfig.provider) {
        globalProviders.push(
          moduleConfig.provider as unknown as GlobalProviderComponent
        )
      }
    } catch (e) {
      console.error(`Failed to load module ${mod.name}:`, e)
    }
  }

  return {
    routes: sortRoutes(ROUTES, categoryOrder),
    globalProviders,
    categoryTranslations: categoryOrder
  }
}
