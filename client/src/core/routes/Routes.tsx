import type { ModuleCategory } from './interfaces/routes_interfaces'
import RouteItems from './routes.json'

function resolveAlias(path: string): string {
  if (path.startsWith('@apps')) {
    return path.replace('@apps', '../../apps')
  }

  if (path.startsWith('@core')) {
    return path.replace('@core', '../pages')
  }

  return path
}

async function loadRoutes(): Promise<ModuleCategory[]> {
  const routePromises = RouteItems.map(async route => {
    const { title, items } = route

    const importPromises = items.map(async item => {
      const resolved = `${resolveAlias(item)}/config.tsx`

      try {
        const mod = await import(resolved)

        return mod.default
      } catch {
        throw new Error(`Module not found: ${resolved}`)
      }
    })

    const awaitedRoutes = await Promise.all(importPromises)

    return {
      title,
      items: awaitedRoutes
    }
  })

  return Promise.all(routePromises)
}

export const ROUTES = await loadRoutes()

export default ROUTES
