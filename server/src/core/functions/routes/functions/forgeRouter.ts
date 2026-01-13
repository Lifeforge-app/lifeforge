import { ForgeRouter, RouterInput } from '@lifeforge/server-sdk'
import { Router } from 'express'

import { registerController } from './controllerLogic'
import { ForgeControllerBuilder } from './forgeController'

function isRouter(value: unknown): value is Router {
  return !!(
    value &&
    typeof value === 'object' &&
    'use' in value &&
    typeof (value as Record<string, unknown>).use === 'function'
  )
}

function isForgeController(value: unknown): value is ForgeControllerBuilder {
  return !!(
    value &&
    typeof value === 'object' &&
    '__isForgeController' in value &&
    (value as Record<string, unknown>).__isForgeController === true
  )
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
      const finalRoute = route.replace(/\$/g, '__')

      if (isForgeController(controller)) {
        registerController(controller, router, finalRoute)
      } else if (isRouter(controller)) {
        router.use(`/${finalRoute}`, controller)
      } else if (typeof controller === 'object' && controller !== null) {
        const nestedRouter = Router()

        registerRoutesRecursive(controller as RouterInput, nestedRouter)

        router.use(`/${finalRoute}`, nestedRouter)
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

export { registerRoutes }
