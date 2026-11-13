import { type ModuleEntry } from '@lifeforge/configs'

import { loadModuleRoutes } from './loadModuleRoutes'
import { watchModules } from './watchModules'

export interface ModuleLoaderOptions {
  /** Absolute path to the directory containing module folders. */
  modulesDir: string
  /** Whether the server is running in production. */
  isProduction: boolean
}

/**
 * Owns the module lifecycle: scanning the modules directory, importing server
 * route trees, keeping `ModuleRegistry` in sync, and watching for changes.
 */
export function createModuleLoader({
  modulesDir,
  isProduction
}: ModuleLoaderOptions) {
  let disposeWatcher: (() => void) | null = null

  return {
    /**
     * Scans `modulesDir`, reconciles `ModuleRegistry`, imports new module
     * server routes, and returns the full map of module route trees.
     */
    load(): Promise<Record<string, ModuleEntry>> {
      return loadModuleRoutes({ modulesDir, isProduction })
    },

    /** Watches `modulesDir` and invokes `onReload` when it changes. */
    watch(onReload: () => void | Promise<void>): void {
      disposeWatcher?.()
      disposeWatcher = watchModules(modulesDir, onReload)
    },

    /** Stops watching for module changes. */
    dispose(): void {
      disposeWatcher?.()
      disposeWatcher = null
    }
  }
}

export type ModuleLoader = ReturnType<typeof createModuleLoader>
