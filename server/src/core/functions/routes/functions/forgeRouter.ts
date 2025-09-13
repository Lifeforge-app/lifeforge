import { Router } from 'express'

import { ForgeRouter, RouterInput } from '../typescript/forge_router.types'
import { ForgeControllerBuilder } from './forgeController'

function isRouter(value: unknown): value is Router {
  return !!(
    value &&
    typeof value === 'object' &&
    'use' in value &&
    typeof (value as Record<string, unknown>).use === 'function'
  )
}

/**
 * A utility function to define a router configuration object.
 *
 * This function serves as a type-safe way to create a router configuration
 * object that maps route names to either ForgeControllerBuilder instances,
 * Express Router instances, or nested router objects. It ensures that the
 * provided routes conform to the expected structure defined by the RouterInput type.
 *
 * @template T - The type of the router input configuration, extending RouterInput
 * @param routes - An object mapping route names to controllers, routers, or nested objects
 * @returns The same routes object, typed as T
 *
 * @example
 * ```typescript
 * const routes = forgeRouter({
 *   users: forgeController.query()...,
 *   posts: {
 *     list: forgeController.query()...,
 *     create: forgeController.mutation()...
 *   },
 * });
 * ```
 */
function forgeRouter<T extends RouterInput>(routes: T): T {
  return routes
}

/**
 * Registers routes from a ForgeRouter configuration into an Express Router.
 *
 * This function recursively processes a router configuration object and creates
 * the corresponding Express routes. It handles three types of route values:
 * - ForgeControllerBuilder instances: Registered directly with their route path
 * - Express Router instances: Mounted as sub-routers
 * - Nested objects: Processed recursively to create nested route structures
 *
 * @template T - The type of the router input configuration, extending RouterInput
 * @param forgeRouter - The ForgeRouter configuration object containing route definitions
 * @returns An Express Router instance with all routes registered and configured
 *
 * @example
 * ```typescript
 * const routes = {
 *   users: forgeController.query()...,
 *   posts: {
 *     list: forgeController.query()...,
 *     create: forgeController.mutation()...
 *   },
 * };
 * const router = registerRoutes(routes);
 * ```
 */
function registerRoutes<T extends RouterInput>(
  forgeRouter: ForgeRouter<T>
): Router {
  const expressRouter = Router()

  function registerRoutesRecursive(routes: RouterInput, router: Router): void {
    for (const [route, controller] of Object.entries(routes)) {
      if (controller instanceof ForgeControllerBuilder) {
        controller.register(router, route)
      } else if (isRouter(controller)) {
        router.use(`/${route}`, controller)
      } else if (typeof controller === 'object' && controller !== null) {
        const nestedRouter = Router()

        registerRoutesRecursive(controller as RouterInput, nestedRouter)
        router.use(`/${route}`, nestedRouter)
      } else {
        console.warn(
          `Skipping route ${route}: not a valid controller, router, or nested object`
        )
      }
    }
  }

  registerRoutesRecursive(forgeRouter, expressRouter)

  return expressRouter
}

export default forgeRouter

export { registerRoutes }
