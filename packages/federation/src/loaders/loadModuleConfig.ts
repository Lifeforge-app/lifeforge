import {
  getInstance,
  init,
  loadRemote,
  registerRemotes
} from '@module-federation/runtime'

import { type InferOutput, globalProxyRegistry } from '@lifeforge/api'
import {
  type ModuleCategory,
  type ModuleConfig,
  moduleConfigSchema
} from '@lifeforge/configs'

import { forgeAPI } from '../utils/forgeAPI'

export type FederatedModule = InferOutput<
  typeof forgeAPI.modules.manifest
>['modules'][number]

export async function fetchModuleManifest(
  apiHost: string
): Promise<FederatedModule[]> {
  try {
    const { modules } = await forgeAPI.modules.manifest.setHost(apiHost).query()

    return modules ?? []
  } catch (e) {
    console.warn('Failed to fetch module manifest:', e)

    return []
  }
}

/**
 * Maps module short name to import function for dev mode
 * Uses Vite's glob import for dynamic loading from apps directory
 */
/**
 * Gets the dev mode import function for a module
 */
function getDevModeImport(
  moduleName: string,
  devModeImports: Record<string, () => Promise<{ default: ModuleConfig }>>,
  devModePkgs: Record<string, { name: string }> = {}
): (() => Promise<{ default: ModuleConfig }>) | null {
  for (const [importPath, importFn] of Object.entries(devModeImports)) {
    const pkgPath = importPath.replace(
      /\/client\/manifest\.ts$/,
      '/package.json'
    )

    if (devModePkgs[pkgPath]?.name === moduleName) {
      return importFn as () => Promise<{ default: ModuleConfig }>
    }
  }

  return null
}

/**
 * Loads a module config - either from dev source or federation bundle
 */
export async function loadModuleConfig(
  mod: FederatedModule,
  devModeImports: Record<string, () => Promise<{ default: ModuleConfig }>> = {},
  devModePkgs: Record<string, { name: string }> = {}
): Promise<ModuleCategory['items'][number]> {
  let unwrapped: ModuleConfig

  // Dev mode: import directly from source for hot-reload
  if (import.meta.env.DEV) {
    const devImport = getDevModeImport(mod.name, devModeImports, devModePkgs)

    if (devImport) {
      const devModule = await devImport()

      unwrapped = devModule.default
    } else {
      console.warn(
        `Dev mode import not found for ${mod.name}, falling back to federation`
      )
      unwrapped = await loadFromFederation(mod)
    }
  } else {
    // Normal mode: use federation
    unwrapped = await loadFromFederation(mod)
  }

  const validation = moduleConfigSchema.safeParse(unwrapped)

  if (!validation.success) {
    throw new Error(
      `Module configuration validation failed for ${mod.name}: ${validation.error.message}`
    )
  }

  const moduleConfig: ModuleCategory['items'][number] = {
    name: mod.name,
    moduleId: mod.moduleId,
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
    widgets: unwrapped.widgets,
    contract: unwrapped.contract
  }

  if (unwrapped.contract) {
    globalProxyRegistry.set(unwrapped.contract, {
      moduleId: mod.moduleId
    })
  }

  return moduleConfig
}

export const registeredRemotesSet = new Set<string>()

/**
 * Loads module config via federation (from remoteEntry.js)
 */
async function loadFromFederation(mod: FederatedModule): Promise<ModuleConfig> {
  const remoteName = mod.name.replace(/^@[^/]+\//, '').replace(/-+/g, '_')

  if (!registeredRemotesSet.has(remoteName)) {
    if (!getInstance()) {
      init({
        name: 'host',
        remotes: [
          {
            name: remoteName,
            entry: `${import.meta.env.VITE_API_HOST}${mod.remoteEntryUrl}`,
            type: 'module'
          }
        ]
      })
    } else {
      registerRemotes([
        {
          name: remoteName,
          entry: `${import.meta.env.VITE_API_HOST}${mod.remoteEntryUrl}`,
          type: 'module'
        }
      ])
    }
    registeredRemotesSet.add(remoteName)
  }

  const remoteModule = await loadRemote<{ default: unknown }>(
    `${remoteName}/Manifest`
  )
  const unwrapped = (remoteModule?.default || remoteModule) as ModuleConfig

  if (!unwrapped) {
    throw new Error(`Failed to load federated manifest: ${mod.name}`)
  }

  return unwrapped
}
