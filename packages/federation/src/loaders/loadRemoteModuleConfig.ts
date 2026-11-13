import {
  getInstance,
  init,
  loadRemote,
  registerRemotes
} from '@module-federation/runtime'

import type { ProxyScope } from '@lifeforge/api'
import {
  type ModuleConfig,
  type ModuleGroup,
  moduleConfigSchema
} from '@lifeforge/configs'

import { type FederatedModule } from '../utils/fetchModuleData'

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
      return importFn
    }
  }

  return null
}

/**
 * Loads a module config - either from dev source or federation bundle
 */
export async function loadRemoteModuleConfig(
  mod: FederatedModule,
  devModeImports: Record<string, () => Promise<{ default: ModuleConfig }>> = {},
  devModePkgs: Record<string, { name: string }> = {}
): Promise<ModuleGroup['items'][number]> {
  let unwrapped: ModuleConfig

  // Dev mode: import directly from source for hot-reload
  if (import.meta.env.DEV) {
    const devImport = getDevModeImport(mod.name, devModeImports, devModePkgs)

    if (devImport) {
      try {
        const devModule = await devImport()

        unwrapped = devModule.default
      } catch (error) {
        // Source may have been removed (e.g. the module was installed and
        // cleaned). Fall back to the built federation bundle.
        console.warn(
          `Dev mode import failed for ${mod.name}, falling back to federation:`,
          error
        )
        unwrapped = await loadFromFederation(mod)
      }
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

  const moduleConfig: ModuleGroup['items'][number] = {
    name: mod.name,
    id: mod.id,
    remoteId: mod.remoteId,
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

  const scope = (unwrapped as { __scope?: ProxyScope }).__scope

  if (!scope) {
    throw new Error(`Module ${mod.name} did not expose a proxy scope`)
  }

  scope.remoteId = mod.remoteId

  return moduleConfig
}

export const registeredRemotesSet = new Set<string>()

/**
 * Loads module config via federation (from remoteEntry.js)
 */
async function loadFromFederation(mod: FederatedModule): Promise<ModuleConfig> {
  const remoteName = `m_${mod.remoteId}`

  if (!registeredRemotesSet.has(remoteName)) {
    const remoteConfig = {
      name: remoteName,
      entry: mod.remoteEntryUrl.startsWith('http')
        ? mod.remoteEntryUrl
        : `${import.meta.env.VITE_API_HOST || ''}${mod.remoteEntryUrl}`,
      type: 'module'
    }

    if (!getInstance()) {
      init({
        name: 'host',
        remotes: [remoteConfig]
      })
    } else {
      registerRemotes([remoteConfig])
    }
    registeredRemotesSet.add(remoteName)
  }

  const remoteModule = await loadRemote<{ default: unknown }>(
    `${remoteName}/Manifest`
  )
  const remote = remoteModule?.default || remoteModule

  if (!remote) {
    throw new Error(`Failed to load federated manifest: ${mod.name}`)
  }

  return remote as ModuleConfig
}
