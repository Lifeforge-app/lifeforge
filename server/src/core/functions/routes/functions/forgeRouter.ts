import { Router } from 'express'

import { ForgeRouter, RouterInput } from '../typescript/forge_router.types'
import { ForgeControllerBuilder } from './forgeController'

export type InferRouterStructure<T> = T extends ForgeRouter<infer U> ? U : never

function isRouter(value: unknown): value is Router {
  return !!(
    value &&
    typeof value === 'object' &&
    'use' in value &&
    typeof (value as Record<string, unknown>).use === 'function'
  )
}

function forgeRouter<T extends RouterInput>(routes: T): T {
  return routes
}

function registerRoutes<T extends RouterInput>(
  forgeRouter: ForgeRouter<T>
): Router {
  const expressRouter = Router()

  function registerRoutesRecursive(routes: RouterInput, router: Router): void {
    for (const [route, controller] of Object.entries(routes)) {
      if (controller instanceof ForgeControllerBuilder) {
        controller.register(router)
      } else if (isRouter(controller)) {
        if (!route.startsWith('/')) {
          throw new Error(`Route "${route}" must start with a '/'`)
        }
        router.use(route, controller)
      } else if (typeof controller === 'object' && controller !== null) {
        const nestedRouter = Router()

        if (!route.startsWith('/')) {
          throw new Error(`Nested route "${route}" must start with a '/'`)
        }

        registerRoutesRecursive(controller as RouterInput, nestedRouter)
        router.use(route, nestedRouter)
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
