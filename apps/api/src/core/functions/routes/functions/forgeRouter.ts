import { Router } from 'express'

import {
  ForgeContract,
  ForgeRouter,
  RouterInput
} from '@lifeforge/server-utils'

import { disableRateLimitForRoute } from '../../../middlewares/rateLimitingMiddleware'
import { registerController } from './controllerLogic'

function isRouter(value: unknown): value is Router {
  return !!(
    value &&
    typeof value === 'object' &&
    'use' in value &&
    typeof (value as Record<string, unknown>).use === 'function'
  )
}

function isForgeController(value: unknown): value is ForgeContract {
  return !!(
    value &&
    typeof value === 'object' &&
    '__isForgeContract' in value &&
    (value as Record<string, unknown>).__isForgeContract === true
  )
}

interface AliasScan {
  aliases: Set<string>
  hasUnAliasedController: boolean
}

function collectAliases(routes: RouterInput, scan: AliasScan): void {
  for (const value of Object.values(routes)) {
    if (isForgeController(value)) {
      if (value.modulePathAlias) {
        scan.aliases.add(value.modulePathAlias)
      } else {
        scan.hasUnAliasedController = true
      }
    } else if (
      typeof value === 'object' &&
      value !== null &&
      !isRouter(value)
    ) {
      collectAliases(value as RouterInput, scan)
    }
  }
}

/**
 * Returns the module path alias for a route tree only when **every** controller
 * in the tree shares the same alias. Ancestor trees (the core routes plus the
 * `modules` container) also contain unaliased core controllers, so they resolve
 * to `undefined` and each module's alias is mounted at the module's own level
 * instead of the whole app being nested under it.
 */
function extractAlias(routes: RouterInput): string | undefined {
  const scan: AliasScan = {
    aliases: new Set<string>(),
    hasUnAliasedController: false
  }

  collectAliases(routes, scan)

  if (scan.hasUnAliasedController || scan.aliases.size !== 1) {
    return undefined
  }

  return scan.aliases.values().next().value
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
 *   users: forgeContract.query()...,
 *   posts: {
 *     list: forgeContract.query()...,
 *     create: forgeContract.mutation()...
 *   },
 * };
 * const router = registerRoutes(routes);
 * ```
 */
function registerRoutes<T extends RouterInput>(
  forgeRouter: ForgeRouter<T>
): Router {
  const expressRouter = Router()
  const registeredAliases = new Set<string>()

  function registerRoutesRecursive(
    routes: RouterInput,
    router: Router,
    parentPath = ''
  ): void {
    const alias = extractAlias(routes)

    if (alias && !registeredAliases.has(alias)) {
      registeredAliases.add(alias)

      const aliasRouter = Router()

      registerRoutesRecursive(routes, aliasRouter, `/${alias}`)

      expressRouter.use(`/${alias}`, aliasRouter)
    }

    for (const [route, controller] of Object.entries(routes)) {
      const finalRoute = route.replace(/\$/g, '--')

      const currentPath = `${parentPath}/${finalRoute}`

      if (isForgeController(controller)) {
        const config = controller.getValue()

        if (config.rateLimit === false) {
          disableRateLimitForRoute(config.method, currentPath)
        }
        registerController(controller, router, finalRoute)
      } else if (isRouter(controller)) {
        router.use(`/${finalRoute}`, controller)
      } else if (typeof controller === 'object' && controller !== null) {
        const nestedRouter = Router()

        registerRoutesRecursive(
          controller as RouterInput,
          nestedRouter,
          currentPath
        )

        router.use(`/${finalRoute}`, nestedRouter)
      } else {
        console.warn(
          `Skipping route "${route}" at path "${currentPath}": not a valid controller, router, or nested object. Value type: ${typeof controller}, Value: ${JSON.stringify(controller)?.slice(0, 100)}`
        )
      }
    }
  }

  registerRoutesRecursive(forgeRouter, expressRouter)

  return expressRouter
}

export { registerRoutes }
