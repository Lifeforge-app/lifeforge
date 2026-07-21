import { registerHooks } from 'node:module'

import { moduleLoaderLogger } from './moduleRegistry'

/**
 * Registers custom module resolution hooks for development mode,
 * allowing modules to use `@/` path aliases that resolve relative to
 * the module's own `server/` directory.
 */
export default function registerDevResolverHooks(): void {
  try {
    registerHooks({
      resolve: (specifier, context, nextResolve) => {
        if (specifier.startsWith('@/')) {
          const parentURL = context.parentURL

          if (parentURL) {
            const match = parentURL.match(/(.*\/modules\/[^/]+\/server)\//)

            if (match) {
              const serverRoot = match[1]
              const relativePath = specifier.slice(2)
              const resolvedSpecifier = new URL(
                relativePath,
                serverRoot + '/'
              ).href

              return nextResolve(resolvedSpecifier, context)
            }
          }
        }

        return nextResolve(specifier, context)
      }
    })
  } catch (e) {
    moduleLoaderLogger.error(
      `Failed to register custom path alias resolver hooks: ${e}`
    )
  }
}
