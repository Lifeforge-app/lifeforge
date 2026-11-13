import express, { type Router } from 'express'

import { type ModuleEntry } from '@lifeforge/configs'

import { createModuleLoader } from './createModuleLoader'

export interface ModuleRuntimeOptions {
  /** Absolute path to the directory containing module folders. */
  modulesDir: string
  /** Whether the server is running in production. */
  isProduction: boolean
  /** The express router the application mounts; the module sub-router is mounted here. */
  outerRouter: Router
  /** Builds (and returns) the full route tree from the module route trees. */
  buildRouter: (appRoutes: Record<string, ModuleEntry>) => Router
}

/**
 * Owns the module request lifecycle: loading module route trees, mounting a
 * swappable sub-router on the application's router, reloading on changes, and
 * watching the modules directory.
 *
 * The sub-router is mounted **directly** (not behind a dispatch function) and
 * swapped in-place on reload, so the router stays introspectable (e.g. by
 * `traceRouteStack`).
 */
export function createModuleRuntime({
  modulesDir,
  isProduction,
  outerRouter,
  buildRouter
}: ModuleRuntimeOptions) {
  const loader = createModuleLoader({ modulesDir, isProduction })

  // Mount a placeholder so the caller controls the outer stack order
  // (e.g. static assets → module routes → 404).
  let currentRouter: Router = express.Router()

  outerRouter.use('/', currentRouter)

  let reloadInFlight: Promise<void> | null = null

  /**
   * Rebuilds the module route tree and swaps it into the outer router.
   * Concurrent calls are coalesced.
   */
  function reload(): Promise<void> {
    if (reloadInFlight) {
      return reloadInFlight
    }

    reloadInFlight = loader
      .load()
      .then(appRoutes => {
        const newRouter = buildRouter(appRoutes)

        const layer = outerRouter.stack.find(
          candidate => (candidate.handle as unknown) === currentRouter
        )

        if (layer) {
          layer.handle = newRouter
        }

        currentRouter = newRouter
      })
      .finally(() => {
        reloadInFlight = null
      })

    return reloadInFlight
  }

  /** Watches the modules directory and reloads on changes. */
  function watch(): void {
    loader.watch(() => reload())
  }

  /** Stops watching for module changes. */
  function dispose(): void {
    loader.dispose()
  }

  return { reload, watch, dispose }
}

export type ModuleRuntime = ReturnType<typeof createModuleRuntime>
