import { ModuleCategory } from './interfaces/routes_interfaces'
import RouteItems from './routes.json'

export const ROUTES: ModuleCategory[] = []

const modules = import.meta.glob([
  '../../apps/**/config.tsx',
  '../pages/**/config.tsx'
])

function resolveAlias(path: string): string {
  if (path.startsWith('@apps')) {
    return path.replace('@apps', '../../apps')
  }
  if (path.startsWith('@core')) {
    return path.replace('@core', '../pages')
  }

  return path
}

for (const route of RouteItems) {
  const { title, items } = route

  const importPromises = items.map(async item => {
    const resolved = `${resolveAlias(item)}/config.tsx`
    const importer = modules[resolved]

    if (!importer) throw new Error(`Module not found: ${resolved}`)

    const mod = (await importer()) as { default: any }
    return mod.default
  })

  const awaitedRoutes = await Promise.all(importPromises)

  ROUTES.push({
    title,
    items: awaitedRoutes
  })
}

export default ROUTES
