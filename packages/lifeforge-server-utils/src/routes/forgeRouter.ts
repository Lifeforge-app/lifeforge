import { Router } from 'express'

export interface RouterInput {
  [key: string]:
    | Router
    | {
        __isForgeController: true
      }
    | RouterInput
}

export type ForgeRouter<T extends RouterInput> = T

/**
 * A utility function to define a router configuration object.
 *
 * This function serves as a type-safe way to create a router configuration
 * object that maps route names to either forgeBuilder instances,
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
 *   users: forge.query()...,
 *   posts: {
 *     list: forge.query()...,
 *     create: forge.mutation()...
 *   },
 * });
 * ```
 */
export default function forgeRouter<T extends RouterInput>(routes: T): T {
  return routes
}
