import { registerRemotes, loadRemote } from '@module-federation/runtime'
import { globalProxyRegistry } from '@lifeforge/api'
import {
  type ModuleCategory,
  type ModuleConfig,
  moduleConfigSchema
} from '@lifeforge/configs'

export interface FederatedModule {
  name: string
  displayName: string
  version: string
  description: string
  author: string
  icon: string
  category: string
  remoteEntryUrl: string
  isDevMode: boolean
  APIKeyAccess?: Record<string, { usage: string; required: boolean }>
  moduleId: string
}

/**
 * Fetches module manifest from the server
 */
export async function fetchModuleManifest(
  forgeAPI: any
): Promise<FederatedModule[]> {
  try {
    const { modules } = await forgeAPI.modules.manifest.query()

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
  devModeImports: Record<string, () => Promise<{ default: ModuleConfig }>>
): (() => Promise<{ default: ModuleConfig }>) | null {
  // Module names are like "lifeforge--music" or "jiahuiiiii--stock"
  // The glob path is "../../modules/lifeforge--music/client/manifest.ts"
  const shortName = moduleName.replace('@lifeforge/', '')

  for (const [path, importFn] of Object.entries(devModeImports)) {
    if (path.includes(`/modules/${shortName}/`)) {
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
  devModeImports: Record<string, () => Promise<{ default: ModuleConfig }>> = {}
): Promise<ModuleCategory['items'][number]> {
  let unwrapped: ModuleConfig

  // Dev mode: import directly from source for hot-reload
  if (import.meta.env.DEV && mod.isDevMode) {
    const devImport = getDevModeImport(mod.name, devModeImports)

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

/**
 * Loads module config via federation (from remoteEntry.js)
 */
async function loadFromFederation(mod: FederatedModule): Promise<ModuleConfig> {
  const remoteName = mod.name.replace(/-+/g, '_')

  registerRemotes([
    {
      name: remoteName,
      entry: `${import.meta.env.VITE_API_HOST}${mod.remoteEntryUrl}`,
      type: 'module'
    }
  ])

  const remoteModule = await loadRemote<any>(`${remoteName}/Manifest`)
  const unwrapped = (remoteModule?.default || remoteModule) as ModuleConfig

  if (!unwrapped) {
    throw new Error(`Failed to load federated manifest: ${mod.name}`)
  }

  return unwrapped
}
