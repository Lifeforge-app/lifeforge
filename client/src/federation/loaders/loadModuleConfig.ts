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
  isDevMode?: boolean
  APIKeyAccess?: Record<string, { usage: string; required: boolean }>
}

/**
 * Fetches module manifest from the server
 */
export async function fetchModuleManifest(): Promise<FederatedModule[]> {
  try {
    const { modules } = await forgeAPI.untyped('modules/manifest').query()

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
const devModeImports = import.meta.glob<{ default: ModuleConfig }>(
  '../../../../apps/*/client/manifest.ts',
  { eager: false }
)

/**
 * Gets the dev mode import function for a module
 */
function getDevModeImport(
  moduleName: string
): (() => Promise<{ default: ModuleConfig }>) | null {
  // Module names are like "lifeforge--music" or "jiahuiiiii--stock"
  // The glob path is "../../apps/lifeforge--music/client/manifest.ts"
  const shortName = moduleName.replace('@lifeforge/', '')

  for (const [path, importFn] of Object.entries(devModeImports)) {
    if (path.includes(`/apps/${shortName}/`)) {
      return importFn as () => Promise<{ default: ModuleConfig }>
    }
  }

  return null
}

/**
 * Loads a module config - either from dev source or federation bundle
 */
export async function loadModuleConfig(
  mod: FederatedModule
): Promise<ModuleCategory['items'][number]> {
  let unwrapped: ModuleConfig

  // Dev mode: import directly from source for hot-reload
  if (import.meta.env.DEV && mod.isDevMode) {
    const devImport = getDevModeImport(mod.name)

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

/**
 * Loads module config via federation (from remoteEntry.js)
 */
async function loadFromFederation(mod: FederatedModule): Promise<ModuleConfig> {
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

  return unwrapped
}
