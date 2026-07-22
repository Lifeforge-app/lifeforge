import { getInstance, init, registerRemotes } from '@module-federation/runtime'

import type { ModuleGroup } from '@lifeforge/configs'

import { type FederatedModuleGroup } from '../providers/FederationProvider'
import {
  type CategoryOrder,
  type FederatedModule,
  fetchCategoryOrder,
  fetchModuleManifest
} from '../utils/fetchModuleData'
import { sortRoutes } from '../utils/sortRoutes'
import { registeredRemotesSet } from './loadRemoteModuleConfig'

/**
 * Adds the module configuration to the moduleGroups
 */
function addToRoute(
  moduleGroups: ModuleGroup[],
  category: string,
  moduleConfig: ModuleGroup['items'][number]
) {
  const categoryIndex = moduleGroups.findIndex(cat => cat.title === category)

  if (categoryIndex > -1) {
    const cat = moduleGroups[categoryIndex]

    if (cat) {
      cat.items.push(moduleConfig)
    }
  } else {
    moduleGroups.push({
      title: category,
      items: [moduleConfig]
    })
  }
}

/**
 * Entry point for constructing the module groups
 * Loads core modules (static) and federated modules (dynamic) from the server
 * Collects providers from module manifests
 */
export async function bootstrapModules(
  apiHost: string,
  coreModules: ModuleGroup['items'][number][] = []
): Promise<{
  moduleGroups: FederatedModuleGroup[]
  globalProviders: React.FC<{ children: React.ReactNode }>[]
  categoryTranslations: CategoryOrder
}> {
  const moduleGroups: FederatedModuleGroup[] = []
  const globalProviders: React.FC<{ children: React.ReactNode }>[] = []

  // Register core/system modules
  for (const mod of coreModules) {
    addToRoute(moduleGroups, mod.category, mod)

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
      entry: mod.remoteEntryUrl.startsWith('http')
        ? mod.remoteEntryUrl
        : `${import.meta.env.VITE_API_HOST || ''}${mod.remoteEntryUrl}`,
      type: 'module' as const
    })

    const moduleConfig: ModuleGroup['items'][number] & {
      rawModule: FederatedModule
    } = {
      name: mod.name,
      moduleId: mod.moduleId,
      icon: mod.icon,
      category: mod.category,
      routes: {},
      widgets: [],
      APIKeyAccess: mod.APIKeyAccess,
      subsection: mod.subsection,
      rawModule: mod
    }

    addToRoute(moduleGroups, mod.category, moduleConfig)
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
    moduleGroups: sortRoutes(moduleGroups, categoryOrder),
    globalProviders,
    categoryTranslations: categoryOrder
  }
}
