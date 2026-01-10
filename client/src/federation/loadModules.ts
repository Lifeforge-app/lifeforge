import type { ModuleCategory } from 'shared'

import forgeAPI from '@/forgeAPI'

import loadCoreModules from './loadCoreModules'
import {
  type GlobalProviderComponent,
  loadGlobalProvider
} from './loadGlobalProvider'
import { fetchModuleManifest, loadModuleConfig } from './loadModuleConfig'
import sortRoutes from './sortRoutes'

/**
 * Fetches category order from the server
 */
async function fetchCategoryOrder(): Promise<string[]> {
  try {
    const response = await forgeAPI.modules.categories.list.queryRaw({})

    return response.categoryOrder ?? []
  } catch (e) {
    console.warn('Failed to fetch category order:', e)

    return []
  }
}

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
 * Also loads GlobalProviders from modules that expose them
 */
export default async function loadModules(): Promise<{
  routes: ModuleCategory[]
  globalProviders: GlobalProviderComponent[]
}> {
  const ROUTES: ModuleCategory[] = []
  const globalProviders: GlobalProviderComponent[] = []

  // Load core modules (static, always available)
  const coreModules = loadCoreModules()

  for (const mod of coreModules) {
    addToRoute(ROUTES, mod.category, mod)
  }

  // Fetch federated modules and category order in parallel
  const [serverManifest, categoryOrder] = await Promise.all([
    fetchModuleManifest(),
    fetchCategoryOrder()
  ])

  for (const mod of serverManifest) {
    try {
      const moduleConfig = await loadModuleConfig(mod)

      addToRoute(ROUTES, mod.category, moduleConfig)

      const globalProvider = await loadGlobalProvider(mod.name)

      if (globalProvider) {
        globalProviders.push(globalProvider)
      }
    } catch (e) {
      console.error(`Failed to load module ${mod.name}:`, e)
    }
  }

  return {
    routes: sortRoutes(ROUTES, categoryOrder),
    globalProviders
  }
}
